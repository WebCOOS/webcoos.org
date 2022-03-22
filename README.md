This file was generated by the [generator-axds-landing-page](generator-axds-landing-page) Yeoman 
generator. To make improvements this starter site, please contribute to that project.

# webcoos-project-site

The project website for WebCOOS

## Development

### Requirements

This project requires Node.js &geq; v14.0.0. It is recommended to use [nvm](https://github.com/nvm-sh/nvm)
to manage multiple Node.js versions.

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

### Update Visual Theme

The file `tailwind.config.js` defines the visual theme of the site. At a minimum you should
specify `primary` and `secondary` colors, each with lighter and darker variants.

### Updating Site Metadata

The file `site.yaml` contains site-wide metadata. Go here to change the header, footer, and
other site-wide metadata.

### Adding Pages

There are two ways to add pages. Simple pages just render the content of a Markdown file. More
complex pages can be implemented as custom React components.

#### Adding a Markdown page

If the content of a page can be fully described by Markdown (i.e. no custom components), add
that file to the `md-content` directory. The structure of files and subdirectories in
`md-content` determines the resulting page routes. For example `md-content/about.md` will be
served on `http://example.org/about/`, and `md-content/about/more.md` will be served on
`http://example.org/about/more/`. Note that a file with the name `index.md` does **not** have
any special significance.

#### Adding a Custom Page

If the content of a page is more complex than can be described by a Markdown file, add
a new Javascript file in the `pages` directory. The file should have a default export that
is a React component. It may also export an `async` function called `getStaticProps` which
allow it to read data from an external source. See the
[Next.js documentation](https://nextjs.org/docs/basic-features/pages) for more information.

Like Markdown content, the structure of the files and subdirectories determine the resulting
routes. However in this case files with the name `index.js` **do** have special significance.
See the [Next.js routing documentation](https://nextjs.org/docs/routing/introduction) for details.

When it makes sense, consider extracting client-configurable content into a `.yaml` file which
is loaded by your page. This makes it easier for non-developers to update content. The default home
page (`src/index.js`) is an example of this. It loads some configuration from `home.yaml`.

React components that do not represent specific pages can be added to the `componenets` directory.

### Adding Static Assets

Static asset files (e.g. images, downloadable files) should be placed in the `public` directory.
These files will be served from the root path of your site. They can be then be referenced in
custom React components, Markdown files, and YAML files. For example, the file `public/logo.png`
will be available as `http://example.org/logo.png`. For more information and caveats, see
the [Next.js static file documentation](https://nextjs.org/docs/basic-features/static-file-serving).

**It is not required, but highly encouraged to add a `favicon.ico` file to the root of the `public`
directory**. If you want to get [fancier](https://bitsofco.de/all-about-favicons-and-touch-icons/)
with [favicons](https://github.com/audreyfeldroy/favicon-cheat-sheet), add them to the `public`
directory as well, and add the appropriate tags to `components/Page.js`.

### Integrating Sphinx Documentation

By default, a `/docs` route is included for rendering documentation generated by
[Sphinx](https://www.sphinx-doc.org/en/master/).

If this is not required for your site, you can safely delete `pages/docs`.

If you do want to integrate Sphinx documentation, you must first generate the documentation
as JSON and then copy it into this project. The `bin/copy-docs` script is provided to help
with the second step.

In your documentation project, generate JSON output:

```shell
sphinx-build -b json sourcedir builddir
```

In this project root:

```shell
./bin/copy-docs /absolute/path/to/builddir docs
```

The last argument is a destination directory relative to this project root. If you choose
something other than `docs`, you need to also rename the `pages/docs` subdirectory and update
the `DOCS_DIR` variable in `pages/docs/[[...slug]].js`.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
