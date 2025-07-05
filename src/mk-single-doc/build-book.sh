# 1. Combine all MkDocs content
python combine_mkdocs.py \
  --input /path/to/your/mkdocs/project \
  --output complete-guide.md

# 2. Convert to multiple formats
python pandoc_converter.py complete-guide.md \
  --output-dir final-documents \
  --formats pdf docx html epub \
  --title "STEM Robotics Complete Guide" \
  --author "Your Name" \
  --create-css
