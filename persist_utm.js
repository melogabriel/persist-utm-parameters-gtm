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
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
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

