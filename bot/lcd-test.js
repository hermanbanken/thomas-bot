var lcd = require('./lcd');
var display = new lcd.LCD(0);

display.setColor(0, 60, 255);
display.setCursor(1, 1);
display.write('hi there');
display.setCursor(0,0);  
display.write('more text');
display.waitForQuiescent()
.then(function() {
    rotateColors(display);
})
.fail(function(err) {
    console.log(err);
    display.clearError();
    rotateColors(display);
});

/**
 * Rotate through a color pallette and display the
 * color of the background as text
 */
function rotateColors(display) {
    var red = 0;
    var green = 0;
    var blue = 0;
    display.setColor(red, green, blue);
    setInterval(function() {
        blue += 64;
        if (blue > 255) {
            blue = 0;
            green += 64;
            if (green > 255) {
                green = 0;
                red += 64;
                if (red > 255) {
                    red = 0;
                }
            }
        }
        display.setColor(red, green, blue);
        display.setCursor(0,0);
        display.write('red=' + red + ' grn=' + green + '  ');
        display.setCursor(1,0);
        display.write('blue=' + blue + '   ');  // extra padding clears out previous text
    }, 1000);
}