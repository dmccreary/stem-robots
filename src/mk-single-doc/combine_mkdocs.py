#!/usr/bin/env python3
"""
Pandoc MkDocs Converter
Uses the MkDocs combiner and converts to various formats using Pandoc
"""

import subprocess
import sys
from pathlib import Path
import tempfile
import shutil

class PandocConverter:
    def __init__(self):
        self.supported_formats = {
            'pdf': 'PDF document',
            'docx': 'Microsoft Word document',
            'html': 'HTML document',
            'epub': 'EPUB e-book',
            'latex': 'LaTeX document',
            'odt': 'OpenDocument text'
        }
        
    def check_pandoc(self):
        """Check if pandoc is installed"""
        try:
            result = subprocess.run(['pandoc', '--version'], 
                                 capture_output=True, text=True)
            return result.returncode == 0
        except FileNotFoundError:
            return False
            
    def convert_markdown(self, input_file, output_file, format_type='pdf', 
                        title="STEM Robot Guide", author="Author Name"):
        """Convert markdown to specified format using pandoc"""
        
        if not self.check_pandoc():
            raise RuntimeError("Pandoc is not installed. Please install pandoc first.")
            
        input_path = Path(input_file)
        output_path = Path(output_file)
        
        if not input_path.exists():
            raise FileNotFoundError(f"Input file not found: {input_path}")
            
        # Basic pandoc command
        cmd = [
            'pandoc',
            str(input_path),
            '-o', str(output_path),
            '--from', 'markdown',
            '--to', format_type
        ]
        
        # Add metadata
        if title:
            cmd.extend(['--metadata', f'title={title}'])
        if author:
            cmd.extend(['--metadata', f'author={author}'])
            
        # Format-specific options
        if format_type == 'pdf':
            cmd.extend([
                '--pdf-engine=xelatex',  # Better Unicode support
                '--table-of-contents',
                '--toc-depth=3',
                '--number-sections',
                '--variable', 'geometry:margin=1in',
                '--variable', 'fontsize=11pt',
                '--variable', 'documentclass=article'
            ])
        elif format_type == 'docx':
            cmd.extend([
                '--table-of-contents',
                '--toc-depth=3',
                '--number-sections'
            ])
        elif format_type == 'html':
            cmd.extend([
                '--standalone',
                '--table-of-contents',
                '--toc-depth=3',
                '--number-sections',
                '--css=style.css'  # You can add custom CSS
            ])
        elif format_type == 'epub':
            cmd.extend([
                '--table-of-contents',
                '--toc-depth=3',
                '--number-sections'
            ])
            
        print(f"Converting {input_path} to {format_type.upper()}...")
        print(f"Command: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print(f"Successfully created: {output_path}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"Pandoc conversion failed:")
            print(f"Error: {e.stderr}")
            return False
            
    def batch_convert(self, input_file, output_dir, formats=['pdf', 'docx', 'html'],
                     title="STEM Robot Guide", author="Author Name"):
        """Convert to multiple formats"""
        
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        input_path = Path(input_file)
        base_name = input_path.stem
        
        results = {}
        
        for fmt in formats:
            if fmt not in self.supported_formats:
                print(f"Warning: Unsupported format '{fmt}' skipped")
                continue
                
            output_file = output_path / f"{base_name}.{fmt}"
            success = self.convert_markdown(input_file, output_file, fmt, title, author)
            results[fmt] = success
            
        return results

def create_custom_css():
    """Create a basic CSS file for HTML output"""
    css_content = """
/* Custom CSS for STEM Robot Guide */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
}

h1, h2, h3, h4, h5, h6 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

code {
    background-color: #f8f9fa;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', Consolas, monospace;
}

pre {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    padding: 15px;
    overflow-x: auto;
}

blockquote {
    border-left: 4px solid #3498db;
    margin: 0;
    padding-left: 20px;
    font-style: italic;
    color: #666;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
}

th {
    background-color: #f8f9fa;
    font-weight: bold;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.toc {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    padding: 20px;
    margin: 20px 0;
}
"""
    return css_content

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Convert MkDocs to various formats using Pandoc')
    parser.add_argument('input_file', help='Combined markdown file to convert')
    parser.add_argument('--output-dir', '-o', default='output', help='Output directory')
    parser.add_argument('--formats', '-f', nargs='+', 
                       default=['pdf', 'docx', 'html'],
                       choices=['pdf', 'docx', 'html', 'epub', 'latex', 'odt'],
                       help='Output formats')
    parser.add_argument('--title', '-t', default='STEM Robot Guide', help='Document title')
    parser.add_argument('--author', '-a', default='Author Name', help='Document author')
    parser.add_argument('--create-css', action='store_true', help='Create custom CSS file')
    
    args = parser.parse_args()
    
    converter = PandocConverter()
    
    # Create CSS file if requested
    if args.create_css:
        css_path = Path(args.output_dir) / 'style.css'
        css_path.parent.mkdir(exist_ok=True)
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(create_custom_css())
        print(f"Created CSS file: {css_path}")
    
    # Convert to requested formats
    results = converter.batch_convert(
        args.input_file, 
        args.output_dir, 
        args.formats,
        args.title,
        args.author
    )
    
    print("\nConversion Results:")
    print("==================")
    for fmt, success in results.items():
        status = "✓ Success" if success else "✗ Failed"
        print(f"{fmt.upper():8} {status}")

if __name__ == "__main__":
    main()
