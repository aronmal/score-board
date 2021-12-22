import { useEffect, useState } from "react";

function Test() {
  
  const [testconfig, setTestconfig] = useState(<></>);

  useEffect(() => {

    var fetchPassed: boolean = false;
  
    const getOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    };
  
    const loadTest = async () => {
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

        var jsonVar = result,
        jsonStr = JSON.stringify(jsonVar),
        objs: { p1:string, f:number }[] = [],
        f = {
                brace: 0
            }; // for tracking matches, in particular the curly braces
        if (fetchPassed) {
          jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, (p1) => {
              if (p1.lastIndexOf('{') === (p1.length - 1)) {
                  objs.push({p1: p1, f: f.brace})
                  f.brace += 1;
              } else if (p1.indexOf('}') === 0) {
                  f.brace -= 1;
                  objs.push({p1: p1, f: f.brace})
              } else {
                objs.push({p1: p1, f: f.brace})
              }
              return p1
          });
          console.log(`[INFO] Config pasted!`);
          return <>{objs.map( ({p1, f}) => <div style={{textIndent: `${f * 20}px`}}>{ p1 }</div>)}</>
        }
        return <p>An error occurred while fetching the config data!</p>
      });

    });
    
  }, []);

  return testconfig
}

export default Test;

