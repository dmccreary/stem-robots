#!/usr/bin/env python3
"""
MkDocs Content Combiner
Combines all markdown files from an MkDocs project into a single document
"""

import os
import yaml
import re
from pathlib import Path
import shutil

class MkDocsCombiner:
    def __init__(self, mkdocs_path="."):
        self.mkdocs_path = Path(mkdocs_path)
        self.docs_dir = None
        self.nav = None
        self.combined_content = []
        self.images_copied = set()
        
    def load_config(self):
        """Load mkdocs.yml configuration"""
        config_file = self.mkdocs_path / "../../mkdocs.yml"
        if not config_file.exists():
            raise FileNotFoundError("mkdocs.yml not found")
            
        with open(config_file, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
            
        self.docs_dir = self.mkdocs_path / config.get('docs_dir', '../../docs')
        self.nav = config.get('nav', [])
        
        print(f"Docs directory: {self.docs_dir}")
        print(f"Navigation items: {len(self.nav)}")
        
    def copy_images_to_output_dir(self, output_dir):
        """Copy all images to output directory and return mapping"""
        images_dir = Path(output_dir) / "../../docs"
        images_dir.mkdir(exist_ok=True)
        
        image_mapping = {}
        
        # Find all image files in docs directory
        for img_path in self.docs_dir.rglob("*"):
            if img_path.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
                # Create relative path for the image
                rel_path = img_path.relative_to(self.docs_dir)
                new_name = f"img_{len(image_mapping):03d}_{img_path.name}"
                new_path = images_dir / new_name
                
                # Copy image
                shutil.copy2(img_path, new_path)
                
                # Store mapping for reference replacement
                image_mapping[str(rel_path)] = f"images/{new_name}"
                image_mapping[str(rel_path).replace('\\', '/')] = f"images/{new_name}"
                
        print(f"Copied {len(image_mapping)} images")
        return image_mapping
        
    def update_image_references(self, content, image_mapping):
        """Update image references in markdown content"""
        # Pattern to match markdown images: ![alt](path)
        img_pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
        
        def replace_image(match):
            alt_text = match.group(1)
            img_path = match.group(2)
            
            # Handle relative paths
            if img_path in image_mapping:
                new_path = image_mapping[img_path]
                return f'![{alt_text}]({new_path})'
            
            # Try different path variations
            for old_path, new_path in image_mapping.items():
                if img_path.endswith(old_path) or old_path.endswith(img_path):
                    return f'![{alt_text}]({new_path})'
                    
            # Return original if no mapping found
            return match.group(0)
            
        return re.sub(img_pattern, replace_image, content)
        
    def process_nav_item(self, item, level=0, image_mapping=None):
        """Process a navigation item recursively"""
        if isinstance(item, dict):
            for title, content in item.items():
                if isinstance(content, str):
                    # It's a file reference
                    self.process_file(content, title, level, image_mapping)
                elif isinstance(content, list):
                    # It's a section with sub-items
                    self.combined_content.append(f"\n{'#' * (level + 1)} {title}\n")
                    for sub_item in content:
                        self.process_nav_item(sub_item, level + 1, image_mapping)
        elif isinstance(item, str):
            # Direct file reference
            self.process_file(item, None, level, image_mapping)
            
    def process_file(self, file_path, title, level, image_mapping):
        """Process a single markdown file"""
        full_path = self.docs_dir / file_path
        
        if not full_path.exists():
            print(f"Warning: File not found: {full_path}")
            return
            
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Update image references if mapping provided
            if image_mapping:
                content = self.update_image_references(content, image_mapping)
                
            # Add title if provided and not already in content
            if title and not content.strip().startswith('#'):
                self.combined_content.append(f"\n{'#' * (level + 1)} {title}\n")
                
            # Add the content
            self.combined_content.append(content)
            self.combined_content.append("\n\n---\n\n")  # Section separator
            
            print(f"Processed: {file_path}")
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
    def generate_table_of_contents(self):
        """Generate a table of contents from the navigation"""
        toc = ["# Table of Contents\n"]
        
        def add_toc_item(item, level=0):
            indent = "  " * level
            if isinstance(item, dict):
                for title, content in item.items():
                    if isinstance(content, str):
                        # File reference - add link
                        anchor = title.lower().replace(' ', '-').replace('_', '-')
                        anchor = re.sub(r'[^a-z0-9\-]', '', anchor)
                        toc.append(f"{indent}- [{title}](#{anchor})")
                    elif isinstance(content, list):
                        # Section
                        toc.append(f"{indent}- {title}")
                        for sub_item in content:
                            add_toc_item(sub_item, level + 1)
                            
        for item in self.nav:
            add_toc_item(item)
            
        toc.append("\n---\n")
        return "\n".join(toc)
        
    def combine_docs(self, output_file="combined_docs.md", include_images=True):
        """Main method to combine all documentation"""
        self.load_config()
        
        # Setup output directory
        output_path = Path(output_file)
        output_dir = output_path.parent
        output_dir.mkdir(exist_ok=True)
        
        # Handle images
        image_mapping = None
        if include_images:
            image_mapping = self.copy_images_to_output_dir(output_dir)
            
        # Generate TOC
        toc = self.generate_table_of_contents()
        self.combined_content.append(toc)
        
        # Process navigation structure
        if self.nav:
            for item in self.nav:
                self.process_nav_item(item, 0, image_mapping)
        else:
            # No navigation defined, process all .md files
            print("No navigation found, processing all markdown files...")
            for md_file in self.docs_dir.rglob("*.md"):
                rel_path = md_file.relative_to(self.docs_dir)
                self.process_file(str(rel_path), md_file.stem, 0, image_mapping)
                
        # Write combined content
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(self.combined_content))
            
        print(f"\nCombined documentation written to: {output_file}")
        print(f"Total sections processed: {len([c for c in self.combined_content if c.startswith('#')])}")
        
        if include_images:
            print(f"Images copied to: {output_dir / 'images'}")
            
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Combine MkDocs content into single document')
    parser.add_argument('--input', '-i', default='.', help='Path to MkDocs project')
    parser.add_argument('--output', '-o', default='combined_docs.md', help='Output file name')
    parser.add_argument('--no-images', action='store_true', help='Skip copying images')
    
    args = parser.parse_args()
    
    combiner = MkDocsCombiner(args.input)
    combiner.combine_docs(args.output, not args.no_images)
    
if __name__ == "__main__":
    main()
