Encoding.default_external = "utf-8"

# bundle exec compass clean && bundle exec compass compile --sourcemap && bundle exec compass watch --sourcemap

# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
css_dir = 'css'
sass_dir = 'scss'
images_dir = 'images'

# You can select your preferred output style here (can be overridden via the command line):
#environment = :development #:production #:development
environment = :development #:production #:development
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false

asset_cache_buster :none

# enable_sourcemaps = true
# sass_options = {:sourcemap => true, :debug_info => true}
# enable_sourcemaps = true
