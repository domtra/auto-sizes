# auto-sizes

Script to automatically inject the `sizes` attribute for images with `loading=lazy`.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

This is the accompanying script to my blog post.

## Install

Copy one of the minified scripts from the `dist` folder into your project and include it as a first script inside of the BODY in your HTML.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... -->
</head>
<body>
    <script>
        // CODE GOES HERE
    </script>
    <!-- ... -->
</body>
</html>
```

## Usage

The script will automatically add the `sizes` attribute to all images with `loading=lazy` and a `srcset` attribute that do not have a `sizes` attribute.

Additionally you can add a `data-sizes-auto` attribute to force automatic `sizes` even if the image already has a `sizes` attribute.

To calculate the `<img>` width based on a different element, you can specify a `data-sizes-auto` attribute with a selector as value. This will be used with the `closest()` function to find the element to use for the width calculation. 

Here are some examples

```html
<img srcset="..." loading="lazy"> <!-- sizes will be added -->
<img srcset="..." sizes="..." loading="lazy"> <!-- sizes will not be added -->
<img srcset="..." sizes="..." loading="lazy" data-sizes-auto> <!-- sizes will be added -->
<img srcset="..." loading="lazy" data-sizes-auto=":not(:scope)"> <!-- sizes will be added based on the parent element -->
<img srcset="..." loading="lazy" data-sizes-auto=":not(:scope, picture)"> <!-- sizes will be added based on the closest element that is not a <picture> element -->
<img srcset="..." loading="lazy" data-sizes-auto="html"> <!-- sizes will be added based on the <html> element -->
```

## Structure

The file used to generate the minified scripts is located at `src/index.js`.

I use feature flags via a bitmask to generate different builds. Normally I would lazy load functionality that is not necessarily used with dynamic `import()` statements.

This script, however, is meant to be included as a first script inside of the BODY. Because it is render blocking it should do as little as possible. Therefore I decided to use feature flags to generate different builds.

Currently there are 4 different builds:

- `full`, includes all functionality
- `default`, does not include the `data-sizes-auto` functionality for defining a `closest` selector
- `resize`, does not include the `closest` selector and not the `object-fit` size calculation
- `basic`, only basic functionality, even without a `ResizeObserver` watching for size changes


## Maintainers

[@domtra](https://github.com/domtra)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2023 Dominik Tränklein
