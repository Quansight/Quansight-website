import os
import sys
import glob
import yaml
import pyvips

# See: https://github.com/Quansight/Quansight-website/pull/753
#
# This script takes a directory, goes through all blog posts in that directory,
# and converts any featured images that use SVG to PNG.
#
# To use this script:
#
# 1. Create an environment and install dependencies:
#
#     conda create -n featured-svg-to-png -c conda-forge pyvips pyyaml
#     conda activate featured-svg-to-png
#
# 2. Run the script:
#
#     python featured-svg-to-png.py /path/to/mdx-blog-posts
#
# 3. Finally, deactivate the environment:
#
#     conda deactivate


# Function to convert SVG to PNG
def convert_svg_to_png(svg_path, png_path):
    try:
        # 1200 px width comes from the open graph recommendation
        # See: https://github.com/Quansight/Quansight-website/blob/3d1e583d6f69f12c11438b5cb2f396421fb900e9/libs/shared/ui-components/src/SocialCard/types.ts#L55
        image = pyvips.Image.thumbnail(svg_path, 1200)
        image.write_to_file(png_path)
        print(f"Converted {svg_path} to {png_path}")
        return True
    except Exception as e:
        print(f"Error converting {svg_path} to PNG: {e}")
        return False

# Function to process markdown files with YAML front matter.
#
# It looks for a featured image file pathname in the YAML. If the pathname ends
# with .svg, it opens the file, converts it to .png, then updates the YAML file
# pathname to point to the PNG file.
#
# Assumes the following relationship between the markdown and image file paths:
# <markdown_path>/../../public/<svg_path>
#
# example.md:
# ---
# title: Example Blog Post
# featuredImage:
#   src: /posts/example-blog-post/feat.svg
# ---
# ...
def process_markdown_file(file_path):
    with open(file_path, 'r') as f:
        file_contents = f.read()

    # TODO look into using something like python-frontmatter
    # because this parsing could fail if description has three dashes
    front_matter, content = file_contents.split('---', 2)[1:]
    yaml_data = yaml.safe_load(front_matter.strip())

    if 'featuredImage' in yaml_data and yaml_data['featuredImage']['src'].endswith('.svg'):
        print() # newline

        # Get SVG file path, create PNG file path
        svg_url_path = yaml_data['featuredImage']['src']
        svg_path = os.path.join(os.path.dirname(os.path.dirname(file_path)), "public", svg_url_path[1:])
        png_path = svg_path[:-4] + '.png'

        # Create PNG file from SVG file
        success = convert_svg_to_png(svg_path, png_path)

        if success:
            # Update the YAML frontmatter to point to the PNG file
            png_url_path = svg_url_path[:-4] + '.png'
            updated_contents = file_contents.replace(svg_url_path, png_url_path, 1)
            with open(file_path, 'w') as f:
                f.write(updated_contents)
                print(f"Updated frontmatter in {file_path} to point to {png_url_path}")

            return svg_path

# Main function
def main():
    if len(sys.argv) < 2:
        print("Usage: python featured-svg-to-png.py /path/to/markdown/files")
        sys.exit(1)

    markdown_dir = sys.argv[1]
    markdown_files = glob.glob(os.path.join(markdown_dir, '*.md')) + glob.glob(os.path.join(markdown_dir, '*.mdx'))
    svg_paths = []

    for file in markdown_files:
        svg_path = process_markdown_file(file)
        if (svg_path):
            svg_paths.append(svg_path)

    print() # newline

    # Delete SVG files last because some posts reuse the same SVG file
    for svg_path in set(svg_paths):
        try:
            os.remove(svg_path)
            print(f"File {svg_path} deleted successfully.")
        except OSError as e:
            print(f"Error deleting file {svg_path}: {e}")

if __name__ == "__main__":
    main()
