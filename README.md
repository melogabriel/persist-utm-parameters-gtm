<div align="center">
  <img src="https://img.shields.io/badge/Google%20Tag%20Manager-246FDB.svg?style=for-the-badge&logo=Google-Tag-Manager&logoColor=white" alt="Google Tag Manager" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</div>

# Persist UTM Parameters with GTM



---
To transfer UTM parameters, meaning to retain them across different pages and even sessions on your website, you can utilize cookies or local storage. This allows you to track the origin of a user's traffic even if they navigate to different parts of your site or revisit it later. You can achieve this using tools like Google Tag Manager (GTM) and custom HTML scripts.

---

## Features

- Retrieves UTM parameters from the URL query string.
- Stores UTM parameters in `sessionStorage` to persist them across pages.
- Restores and appends UTM parameters to the URL if they are missing.
- Handles spaces in UTM parameters by encoding them as `+` in the query string.
- Ensures compatibility with URL encoding standards.

---

## Installation

This script can be integrated into a Google Tag Manager (GTM) custom HTML tag for easier deployment across your website. To use this with GTM:

1. Create a new tag in GTM.
2. Select "Custom HTML" as the tag type.
3. Paste the script into the HTML field.
   ```javascript
   <script>
   (function() {
    // Function to get URL parameters
    function getUrlParams() {
      var params = {};
      var queryString = window.location.search.substring(1);
      if (queryString) {
        var pairs = queryString.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          var key = decodeURIComponent(pair[0]);
          var value = pair[1] ? decodeURIComponent(pair[1].replace(/\+/g, ' ')) : ''; // Handle + as space
          params[key] = value;
        }
      }
      return params;
    }

    // Function to set URL parameters with `+` for spaces
    function setUrlParams(params) {
      var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      var newUrl = baseUrl + '?' + Object.keys(params).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]).replace(/%20/g, '+'); // Replace %20 with +
      }).join('&');
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }

    // Get current URL parameters
    var params = getUrlParams();

    // Check for UTM parameters and persist them if they exist
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    var hasUtmParams = utmParams.some(function(param) {
      return params[param];
    });

    if (hasUtmParams) {
      // Store UTM parameters in sessionStorage
      sessionStorage.setItem('utmParams', JSON.stringify(params));
    } else {
      // Retrieve stored UTM parameters if available
      var storedParams = sessionStorage.getItem('utmParams');
      if (storedParams) {
        var parsedParams = JSON.parse(storedParams);
        Object.assign(params, parsedParams);
        setUrlParams(params);
      }
    }
   })();
   </script>
   ```
   
5. Set the tag to trigger on "All Pages" or specific pages where UTM persistence is required.
6. Publish the changes in GTM.

OR

1. Copy the script to your project.
2. Include the script in the `<head>` or `<body>` section of your HTML file:
3. Test the script by navigating to a page with UTM parameters in the URL.

---
## Code Explanation

### Functions

1. **`getUrlParams()`**
   - Parses the URL query string to extract parameters as key-value pairs.
   - Replaces `+` with spaces before decoding the parameters.

   ```javascript
   function getUrlParams() {
     var params = {};
     var queryString = window.location.search.substring(1);
     if (queryString) {
       var pairs = queryString.split('&');
       for (var i = 0; i < pairs.length; i++) {
         var pair = pairs[i].split('=');
         var key = decodeURIComponent(pair[0]);
         var value = pair[1] ? decodeURIComponent(pair[1].replace(/\+/g, ' ')) : '';
         params[key] = value;
       }
     }
     return params;
   }
   ```

2. **`setUrlParams(params)`**
   - Reconstructs the URL with the provided parameters.
   - Encodes parameter values and replaces spaces (`%20`) with `+` for readability and compatibility.

   ```javascript
   function setUrlParams(params) {
     var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
     var newUrl = baseUrl + '?' + Object.keys(params).map(function(key) {
       return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]).replace(/%20/g, '+');
     }).join('&');
     window.history.replaceState({ path: newUrl }, '', newUrl);
   }
   ```

3. **Main Script Logic**
   - Retrieves UTM parameters using `getUrlParams`.
   - Checks if UTM parameters are present and stores them in `sessionStorage`.
   - If no UTM parameters are found in the current URL, retrieves them from `sessionStorage` and appends them to the URL.

   ```javascript
   var params = getUrlParams();

   var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
   var hasUtmParams = utmParams.some(function(param) {
     return params[param];
   });

   if (hasUtmParams) {
     sessionStorage.setItem('utmParams', JSON.stringify(params));
   } else {
     var storedParams = sessionStorage.getItem('utmParams');
     if (storedParams) {
       var parsedParams = JSON.parse(storedParams);
       Object.assign(params, parsedParams);
       setUrlParams(params);
     }
   }
   ```

---

## How It Works

1. A user lands on your website with UTM parameters, e.g., `https://example.com/?utm_source=google&utm_medium=cpc`.
2. The script stores these parameters in `sessionStorage`.
3. When the user navigates to another page, the script:
   - Checks if UTM parameters are in the URL.
   - If not, appends the stored UTM parameters to the URL.
4. Spaces in UTM parameter values are displayed as `+` for compatibility.

---

## Notes

- The script uses `sessionStorage`, so parameters persist only during the browser session.
- To extend persistence beyond a session, consider using `localStorage` instead of `sessionStorage`.
- Ensure the script is included on all pages where UTM parameter persistence is required.

---

## License

This project is open-source and available under the MIT License. Feel free to use and modify it as needed.

