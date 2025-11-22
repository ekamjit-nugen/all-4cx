export const nodePackage = `import { SearchComponent } from "fourcx-widget/packages/react";`;

export const frameworkCodeSnippets = {
  code: `import Intercom from "fourcx-widget/packages/react";

export default function MyPage() {
  Intercom({
    app_id: constants.intercom_app_id,
    user_id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
  });
};`,

  react: `import React from "react";
import { SearchComponent } from "fourcx-widget/packages/react";

const App = () => {
  return(
    <SearchComponent
      font-size="18px"
      font-style="normal"
      theme-color="#033dfc"
      width-dimension="700px"
      user-id="user_2kuZqCuRDxg9ngVGCeq57qfW86S"
      api-key="api_key"
      variant="1"
    />
  )
};`,

  angular: `import { Component, OnInit } from '@angular/core';
declare const Intercom: any;

@Component({
  selector: 'app-root',
  template: '<h1>Angular Integration</h1>'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    Intercom({
      app_id: constants.intercom_app_id,
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    });
  }
};`,

  vue: `<template>
  <div>Vue Integration</div>
</template>

<script>
import Intercom from "@fourcx/messenger-js-sdk";

export default {
  mounted() {
    Intercom({
      app_id: constants.intercom_app_id,
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    });
  }
};
</script>`,

  ember: `import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class IntercomIntegrationComponent extends Component {
  @action
  initializeIntercom() {
    Intercom({
      app_id: constants.intercom_app_id,
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    });
  }
};`,

  wordpress: `<?php
// WordPress Integration
function initialize_intercom_script() {
  echo "<script>
    Intercom({
      app_id: constants.intercom_app_id,
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    });
  </script>";
}
add_action('wp_footer', 'initialize_intercom_script');
?>`,

  "google-tag-manager": `// Google Tag Manager Integration
// Create a new tag in GTM with the following JavaScript:
(function() {
  Intercom({
    app_id: constants.intercom_app_id,
    user_id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
  });
})();`,

  shopify: `<script>
// Shopify Integration (Theme Script)
document.addEventListener('DOMContentLoaded', function() {
  Intercom({
    app_id: constants.intercom_app_id,
    user_id: Shopify.user.id,
    name: Shopify.user.name,
    email: Shopify.user.email,
    created_at: Shopify.user.created_at,
  });
});
</script>`,

  segment: `// Segment Integration
analytics.identify(user.id, {
  app_id: constants.intercom_app_id,
  name: user.name,
  email: user.email,
  created_at: user.createdAt,
});
analytics.track('Intercom Initialization', {
  message: 'Intercom initialized with user data',
});
`,
};

export const nonUserSnippet = {
  react: `import 4cx from '@4cx/search-widget';
  
export default function Component() {
  Intercom({
    app_id: 'arg2ybvm',
  });

  return <div>Example App</div>;
}`,
};
