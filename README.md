# UTM Parameters Persistence Script

This script is designed to persist UTM parameters across pages on a website. It ensures that UTM parameters are retained and appended to the URL for tracking purposes, even if the user navigates to different pages without UTM parameters in the URL.

---

## Features

- Retrieves UTM parameters from the URL query string.
- Stores UTM parameters in `sessionStorage` to persist them across pages.
- Restores and appends UTM parameters to the URL if they are missing.
- Handles spaces in UTM parameters by encoding them as `+` in the query string.
- Ensures compatibility with URL encoding standards.

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

   var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
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

## Installation

1. Copy the script to your project.
2. Include the script in the `<head>` or `<body>` section of your HTML file:

   ```html
   <script src="path-to-script.js"></script>
   ```

3. Test the script by navigating to a page with UTM parameters in the URL.

---

## How It Works

1. A user lands on your website with UTM parameters, e.g., `https://example.com/?utm_source=google&utm_medium=cpc`.
2. The script stores these parameters in `sessionStorage`.
3. When the user navigates to another page, the script:
   - Checks if UTM parameters are in the URL.
   - If not, appends the stored UTM parameters to the URL.
4. Spaces in UTM parameter values are displayed as `+` for compatibility.

---

## Integration with Google Tag Manager

This script can be integrated into a Google Tag Manager (GTM) custom HTML tag for easier deployment across your website. To use this with GTM:

1. Create a new tag in GTM.
2. Select "Custom HTML" as the tag type.
3. Paste the script into the HTML field.
4. Set the tag to trigger on "All Pages" or specific pages where UTM persistence is required.
5. Publish the changes in GTM.

---

## Notes

- The script uses `sessionStorage`, so parameters persist only during the browser session.
- To extend persistence beyond a session, consider using `localStorage` instead of `sessionStorage`.
- Ensure the script is included on all pages where UTM parameter persistence is required.

---

## License

This project is open-source and available under the MIT License. Feel free to use and modify it as needed.

