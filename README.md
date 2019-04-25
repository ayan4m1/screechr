# Screechr

This software monitors a configurable list of Pterodactyl servers and notifies a Discord text channel when the status changes.

## Documentation

Our more comprehensive documentation is located at [https://docs.screechr.com](https://docs.screechr.com). It has a full tutorial and more exhaustive explanation of the configuration system.

## Screenshot

![Status updates](https://i.imgur.com/5Ln1oUSl.png)

## Tutorial

The tutorial has moved to the [documentation website](https://docs.screechr.com/).

## Configuration

Screechr uses [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig#cosmiconfig), which supports JSON, YAML, or JS-based configuration. The default configuration file is in YAML format, but it should be easily portable if you prefer to work in another.

Your configuration filename should start with `.screechrrc` (note the two Rs at the end) and end with an extension appropriate for the format of the document (e.g. `.screechrrc.yml`).

Please see the [default configuration](.screechrrc.default.yml) for detailed documentation and examples on each of the available options.

## Support

Please check the [documentation](https://docs.screechr.com/help/) for a variety of ways to get help if you are having trouble with installation, configuration, or use of the software. Please do not open GitHub issues for support requests.
