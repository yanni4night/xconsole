##xconsole

Experimental enhanced `console` for rich text display on modern browsers.

Null effects on the obsolete browsers.

![preivew](preview.jpg)

##usage

Log message with "format specifiers":

    
    xconsole.log("30px font size".fontSize30)
    xconsole.log("red foreground".red)
    xconsole.log("blue background".bgBlue)
    xconsole.log("underline".underline)
    xconsole.log("margin 30px".margin30)

You can also chain mutiple styles:

    
    xconsole.log("chain styles".fontSize30.red.bgGreen.bold.margin20.padding10)

Style defined later will overhide the same defined earily:

    
    xconsole.log("yellow foreground but not red".red.yellow)

Note that only the strings in the front of the arguments support the format specifiers:

    
    console.log({}, "this will not work".red)
    console.log("this will work".blue, {}, "this will not work".red)

And only `log`,`debug`,`info`,`error`,`trace`,`warn` support the format specifiers,other functions like `assert`,`clear`,`count`,etc. will work as same as in the native `console` object:

    
    xconsole.count()
    xconsole.assert(true)


##api

######colors&bg
aqua,black,blue,fuchsia,gray,green,lime,maroon,navy,olive,orange,purple,red,silver,teal,white,yellow

e.g.
    
    //The followings have the same result
    "black text".black
    "black text".colorBlack

######font style
bold,italic,oblique,underline,overline,strikethrough

e.g.
    
    "bold text".bold

######font size
12px~100px

e.g.
    
    "30px text".fontSize30

######margin&padding
margin,margin-right,margin-left,margin-top,margin-bottom,padding,padding-right,padding-left,padding-top,padding-bottom

1px~100px

e.g.
    
    "margin left 10px".marginLeft10
    "padding 20px".padding20

######none
No specified style.That may lead to red foreground in `error()`.

e.g.
    
    //The followings have the same result
    "no specified style"
    "no specified style".none


##author
 - <yanni4night@gmail.com>
