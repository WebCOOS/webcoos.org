# Development

## Requirements

This project was originally built against Node.js v16.x, but has been upgraded to use v18.x.

## Setup

```shell
npm install
```

### Running

To run the development server:

```shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In development mode, changes to React components will be hot reloaded. Changes to configuration
or data source files may require a restart to be picked up.

To test the static site generation:

```shell
npm run build
```

And to serve the result:

```shell
npm start
```

## Configuration

The following environment variables are configured:

* `NEXT_PUBLIC_MAPBOX_TOKEN`, for Mapbox.

* `STORYBOOK_MAPBOX_TOKEN`, for Storybook.

* `NEXT_PUBLIC_WEBCOOS_API_TOKEN`, for accessing the WebCOOS API during build and runtime.

An example `.env.template` is available, with contents like the following:

```shell
STORYBOOK_MAPBOX_TOKEN=
NEXT_PUBLIC_MAPBOX_TOKEN=

STORYBOOK_WEBCOOS_API_TOKEN=
NEXT_PUBLIC_WEBCOOS_API_TOKEN=ENTER_THIS_TOKEN_TO_BE_ABLE_TO_BUILD
NEXT_PUBLIC_WEBCOOS_API_URL=https://app.stage.webcoos.org/webcoos/api
```

The easiest way to configure the application is to:

1. Copy the `.env.template` to `.env`:

    `cp .env.template .env`

2. ...and edit the variables.

Alternatively, you can manually set the config items in your environment, or in
an `.envrc` that updates your environment upon `cd`-ing into the
`webcoos-project-site` directory.

**NOTE**: Without the `NEXT_PUBLIC_WEBCOOS_API_TOKEN`, you will not be able to
build (`npm run build`) or run (`npm run dev`) the project. This is by design as
the `webcoos-project-site` requires assets provided by the API in order to build
camera pages ahead of deployment.

If you see errors regarding the `NEXT_PUBLIC_WEBCOOS_API_TOKEN` environment
variable being unset, you will either need to do one of the following to
support your application build.

* Set the `NEXT_PUBLIC_WEBCOOS_API_TOKEN` in your `.env` file to a valid
    token as provided by the targeted WebCOOS API environment (for example,
    `NEXT_PUBLIC_WEBCOOS_API_URL=https://app.stage.webcoos.org/webcoos/api` to
    target the stage environment).

* Set `NEXT_PUBLIC_WEBCOOS_API_TOKEN` before your call to `npm run build`

    ```shell
    export NEXT_PUBLIC_WEBCOOS_API_TOKEN=abc123 npm run build
    ```

If you are building using `docker`, and are also using `docker compose`, you can
use the following to configure the build. This will read the env var values from
the `.env` file, and use them as build args:

```shell
docker compose build
```

You'll also need a Mapbox token to see the camera map components. Export
`NEXT_PUBLIC_MAPBOX_TOKEN` in your shell before starting the development server
or building the static site. Consider setting this in your `.env`.

Set the same value to `STORYBOOK_MAPBOX_TOKEN` if you want to see map components
in Storybook.

You'll also need a WebCOOS API token.  Set this in
`NEXT_PUBLIC_WEBCOOS_API_TOKEN` and `STORYBOOK_WEBCOOS_API_TOKEN`.

These values for these can be found in the CI secrets or by asking an existing developer.

### Optional: Google Analytics

The build process by default sets `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID`
during build and deploy.

You likely will not need to set this locally.  The script tags are emitted when
this env var is present.
