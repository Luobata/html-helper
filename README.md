# html-helper
help to generate css file with the html
what you need to do is to write you html file and then run the node, then you will get a css file which has already init the selector title

###etc
the html:
```javascript
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<link rel="stylesheet" type="text/css" charset="utf-8" href="/web/css/reset.v3.1.1.css" />
<link rel="stylesheet" type="text/css" charset="utf-8" href="/web/css/global.css" />
</head>
<body>
    <div class="test">
        <span class="testspan">
            <div class="sff">
            </div>
        </span>
        <input type="" />
        <span class="sfsf"></span>
    </div>
</body>
</html>
```

then run the node, init the css file:
```css
.test {
}
.test .testspan {
}
.test .testspan .sff {
}
.test .sfsf {
}

```
