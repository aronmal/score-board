function Clock() {
    
    // clock function

    var h = new Date().getHours();
    var m = new Date().getMinutes();
    // var s = new Date().getSeconds();

    var hour = h < 10 ? "0" + h : h;
    var minute = m < 10 ? "0" + m : m;
    // s = s < 10 ? "0" + s : s;

    return (
        `${hour}:${minute}`
    );
  
}

export default Clock;