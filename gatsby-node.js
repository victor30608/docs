const componentWithMDXScope = require('gatsby-plugin-mdx/component-with-mdx-scope');
const path = require('path');
const startCase = require('lodash.startcase');

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  fields {
                    id
                  }
                  tableOfContents
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allMdx.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug ? node.fields.slug : '/',
            component: path.resolve('./src/root.jsx'),
            context: {
              id: node.fields.id,
              pageType: "docs",
            },
          });
        });

        // create redirect pages
        // product page redirects
        createRedirect({ fromPath: '/deepsparse', toPath: '/products/deepsparse', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/sparseml', toPath: '/products/sparseml', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/sparsezoo', toPath: '/products/sparsezoo', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/sparsify', toPath: '/archive/sparsify', isPermanent: true });
        createRedirect({ fromPath: '/products/sparsify', toPath: '/archive/sparsify', isPermanent: true });
        createRedirect({ fromPath: '/products/deepsparse-ent', toPath: '/products/deepsparse/enterprise', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/products/deepsparse-enterprise', toPath: '/products/deepsparse/enterprise', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/sparsification', toPath: '/user-guides/sparsification', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/recipes', toPath: '/user-guides/recipes', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/recipes/creating', toPath: '/user-guides/recipes/creating', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/recipes/enabling', toPath: '/user-guides/recipes/enabling', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/onnx-export', toPath: '/user-guides/onnx-export', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine', toPath: '/user-guides/deepsparse-engine', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine/hardware-support', toPath: '/user-guides/deepsparse-engine/hardware-support', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine/scheduler', toPath: '/user-guides/deepsparse-engine/scheduler', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine/benchmarking', toPath: '/user-guides/deepsparse-engine/benchmarking', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine/diagnostics-debugging', toPath: '/user-guides/deepsparse-engine/diagnostics-debugging', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine/numactl-utility', toPath: '/user-guides/deepsparse-engine/numactl-utility', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deepsparse-engine/logging', toPath: '/user-guides/deepsparse-engine/logging', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deploying-deepsparse', toPath: '/user-guides/deploying-deepsparse', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deploying-deepsparse/deepsparse-server', toPath: '/user-guides/deploying-deepsparse/deepsparse-server', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deploying-deepsparse/amazon-sagemaker', toPath: '/user-guides/deploying-deepsparse/amazon-sagemaker', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deploying-deepsparse/aws-lambda', toPath: '/user-guides/deploying-deepsparse/aws-lambda', redirectInBrowser: true, isPermanent: true });
        createRedirect({ fromPath: '/user-guide/deploying-deepsparse/google-cloud-run', toPath: '/user-guides/deploying-deepsparse/google-cloud-run', redirectInBrowser: true, isPermanent: true });


        // archived pages redirect
        createRedirect({ fromPath: '/sparseml/source/installation.html', toPath: '/get-started/install/sparseml', isPermanent: true });
        createRedirect({ fromPath: '/source/getstarted.html', toPath: '/', isPermanent: true });
        createRedirect({ fromPath: '/deepsparse/source/hardware.html', toPath: '/user-guides/deepsparse-engine/hardware-support', isPermanent: true });
        createRedirect({ fromPath: '/sparsezoo/source/models.html', toPath: 'https://github.com/neuralmagic/sparsezoo/blob/main/docs/source/models.md', isPermanent: true });
        createRedirect({ fromPath: '/sparsezoo/source/recipes.html', toPath: 'https://github.com/neuralmagic/sparsezoo/blob/main/docs/source/recipes.md', isPermanent: true });
        createRedirect({ fromPath: '/sparsify/source/userguide/01-intro.html', toPath: '/archive/sparsify/source/userguide/01-intro.html', isPermanent: true });
      })
    );
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        $components: path.resolve(__dirname, 'src/components'),
        buble: '@philpl/buble', // to reduce bundle size
      },
    },
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-export-default-from',
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);
    let value = parent.relativePath.replace(parent.ext, '');

    if (value === 'index') {
      value = '';
    }

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });
    createNodeField({
      name: `slug`,
      node,
      value: `/${value}`,
    });
    createNodeField({
      name: 'title',
      node,
      value: node.frontmatter.title || startCase(parent.name),
    });
    createNodeField({
      name: 'index',
      node,
      value: node.frontmatter.index,
    });
    createNodeField({
      name: 'groupIndex',
      node,
      value: node.frontmatter.groupIndex,
    });

    // set githubURL from file path
    const srcSearchString = '/src/content/';
    let githubURL = null;
    if (node.fileAbsolutePath.indexOf(srcSearchString) > -1) {
      const fileStub = node.fileAbsolutePath.substr(node.fileAbsolutePath.indexOf(srcSearchString));
      githubURL = 'https://github.com/neuralmagic/docs/blob/main' + fileStub;
    }
    createNodeField({
      name: 'githubURL',
      node,
      value: githubURL,
    });
  }
};

exports.onPostBuild = ({ store }) => {
  const { redirects } = store.getState();
}
