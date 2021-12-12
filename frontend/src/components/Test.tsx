import { useEffect, useState } from "react";

function Test() {
  
  const [testconfig, setTestconfig] = useState('<p>Loading ...</p>');

  useEffect(() => {

    var fetchPassed:Boolean = false;

    const getOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    };

    const loadTest= async () => {
      const response = await fetch('http://localhost:5000/api/get', getOptions)
      .then(res => {
        fetchPassed = true
        console.log('[INFO] Received configData');
        return res.json()
      })
      .catch(error => {
          console.log(error)
          console.log('[WARN] No Connection to Backend/API')
          console.log('[ERROR] Fehler bei abrufen der Konfiguration!')
      });
      return response;
    };

    loadTest().then(result => {
      setTestconfig(() => {
        if (fetchPassed) {
          var jsonVar = result,
          jsonStr = JSON.stringify(jsonVar),
          regeStr = '',
          f = {
                  brace: 0
              }; // for tracking matches, in particular the curly braces
          
          regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
              var rtnFn = function() {
                      return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
                  },
                  rtnStr:any = 0;
              if (p1.lastIndexOf('{') === (p1.length - 1)) {
                  rtnStr = rtnFn();
                  f['brace'] += 1;
              } else if (p1.indexOf('}') === 0) {
                  f['brace'] -= 1;
                  rtnStr = rtnFn();
              } else {
                  rtnStr = rtnFn();
              }
              return rtnStr;
          });
          return regeStr
        }
        return '<p>An error occurred while fetching the config data!</p>'
      });
      console.log(`[INFO] Config pasted!`);
    });

  }, []);

  return (
    <div dangerouslySetInnerHTML={{__html: testconfig}} />
  );
}

export default Test;

