import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "photostack": {
        "background": "#ddd",
        "position": "absolute",
        "textAlign": "center",
        "overflow": "hidden",
        "height": "100%",
        "width": "100%"
    },
    "photostack-start": {
        "cursor": "pointer"
    },
    "photos": {
        "width": "100%",
        "height": "100%"
    },
    "galleryDiv": {
        "marginTop": 0
    },
    "photostack figure": {
        "width": 240,
        "height": "auto",
        "position": "relative",
        "display": "inline-block",
        "background": "#fff",
        "paddingTop": 40,
        "paddingRight": 40,
        "paddingBottom": 40,
        "paddingLeft": 40,
        "textAlign": "center",
        "marginTop": 5,
        "marginRight": 5,
        "marginBottom": 5,
        "marginLeft": 5
    },
    "js photostack figure": {
        "position": "absolute",
        "display": "block",
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "photostack figcaption h2": {
        "marginTop": 20,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "color": "#a7a0a2",
        "fontSize": 16
    },
    "photostack-img": {
        "outline": "none",
        "display": "block",
        "width": 240,
        "height": 240,
        "background": "#f9f9f9"
    },
    "photostack-img img": {
        "width": "100%"
    },
    "photostack-back": {
        "display": "none",
        "position": "absolute",
        "width": "100%",
        "height": "100%",
        "top": 0,
        "left": 0,
        "background": "#fff",
        "fontFamily": "\"Give You Glory\", cursive",
        "color": "#a7a0a2",
        "paddingTop": 50,
        "paddingRight": 40,
        "paddingBottom": 50,
        "paddingLeft": 40,
        "textAlign": "left",
        "fontSize": 22,
        "lineHeight": 1.25,
        "zIndex": 1
    },
    "photostack-back p": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "photostack-back p span": {
        "textDecoration": "line-through"
    },
    "photostack nav": {
        "position": "absolute",
        "width": "100%",
        "bottom": 30,
        "zIndex": 90,
        "textAlign": "center",
        "left": 0,
        "WebkitTransition": "opacity 0.3s",
        "transition": "opacity 0.3s"
    },
    "photostack-start nav": {
        "opacity": 0
    },
    "photostack nav span": {
        "position": "relative",
        "display": "inline-block",
        "marginTop": 0,
        "marginRight": 5,
        "marginBottom": 0,
        "marginLeft": 5,
        "width": 30,
        "height": 30,
        "cursor": "pointer",
        "background": "#aaa",
        "borderRadius": "50%",
        "textAlign": "center",
        "WebkitTransition": "-webkit-transform 0.6s ease-in-out, background 0.3s",
        "transition": "transform 0.6s ease-in-out, background 0.3s",
        "WebkitTransform": "scale(0.48)",
        "transform": "scale(0.48)"
    },
    "photostack nav span:last-child": {
        "marginRight": 0
    },
    "photostack nav span::after": {
        "content": "\\e600",
        "fontFamily": "'icons'",
        "fontSize": "80%",
        "speak": "none",
        "display": "inline-block",
        "verticalAlign": "top",
        "fontStyle": "normal",
        "fontWeight": "normal",
        "fontVariant": "normal",
        "textTransform": "none",
        "lineHeight": 30,
        "color": "#fff",
        "opacity": 0,
        "WebkitFontSmoothing": "antialiased",
        "MozOsxFontSmoothing": "grayscale",
        "WebkitTransition": "opacity 0.3s",
        "transition": "opacity 0.3s",
        "WebkitBackfaceVisibility": "hidden",
        "backfaceVisibility": "hidden"
    },
    "photostack nav spancurrent": {
        "background": "#888",
        "WebkitTransform": "scale(1)",
        "transform": "scale(1)"
    },
    "photostack nav spancurrentflip": {
        "WebkitTransform": "scale(1) rotateY(-180deg) translateZ(-1px)",
        "transform": "scale(1) rotateY(-180deg) translateZ(-1px)",
        "background": "#555"
    },
    "photostack nav spanflippable::after": {
        "opacity": 1,
        "WebkitTransitionDelay": "0.4s",
        "transitionDelay": "0.4s"
    },
    "js photostack-transition::before": {
        "content": "''",
        "position": "absolute",
        "width": "100%",
        "height": "100%",
        "background": "rgba(0,0,0,0.5)",
        "top": 0,
        "left": 0,
        "zIndex": 100,
        "WebkitTransition": "opacity 1s",
        "transition": "opacity 1s",
        "opacity": 1,
        "visibility": "visible"
    },
    "js photostack-transitionphotostack-grid::before": {
        "content": "none",
        "position": "absolute",
        "width": "0%",
        "height": "0%"
    },
    "js photostack-transitionphotostack-grid": {
        "overflow": "scroll"
    },
    "js photostack-transition::after": {
        "opacity": 0,
        "visibility": "hidden"
    },
    "js photostack-transition:hover::after": {
        "opacity": 1,
        "visibility": "visible"
    },
    "touch photostack-transition::after": {
        "opacity": 1,
        "visibility": "visible"
    },
    "photostack figure::after": {
        "content": "''",
        "position": "absolute",
        "width": "100%",
        "height": "100%",
        "top": 0,
        "left": 0,
        "visibility": "visible",
        "opacity": 1,
        "background": "rgba(0,0,0,0.05)",
        "WebkitTransition": "opacity 0.6s",
        "transition": "opacity 0.6s"
    },
    "figurephotostack-current::after": {
        "WebkitTransition": "opacity 0.6s, visibility 0s 0.6s",
        "transition": "opacity 0.6s, visibility 0s 0.6s",
        "opacity": 0,
        "visibility": "hidden"
    },
    "figurehide": {
        "WebkitTransition": "opacity 1s, visibility 0s 1s",
        "transition": "opacity 1s, visibility 0s 1s",
        "opacity": 0,
        "visibility": "hidden",
        "left": -5000
    },
    "photostack-transition figure": {
        "WebkitTransition": "-webkit-transform 0.6s ease-in-out",
        "transition": "transform 0.6s ease-in-out"
    },
    "photostack-perspective": {
        "WebkitPerspective": 1800,
        "perspective": 1800
    },
    "photostack-perspective > div": {
        "WebkitTransformStyle": "preserve-3d",
        "transformStyle": "preserve-3d"
    },
    "photostack-perspective figure": {
        "WebkitTransformStyle": "preserve-3d",
        "transformStyle": "preserve-3d",
        "WebkitBackfaceVisibility": "hidden",
        "backfaceVisibility": "hidden"
    },
    "photostack-perspective figure div": {
        "WebkitBackfaceVisibility": "hidden",
        "backfaceVisibility": "hidden"
    },
    "photostack-perspective figurephotostack-flip": {
        "WebkitTransformOrigin": "0% 50%",
        "transformOrigin": "0% 50%"
    },
    "csstransformspreserve3d figurephotostack-flip photostack-back": {
        "WebkitTransform": "rotateY(180deg)",
        "transform": "rotateY(180deg)",
        "display": "block"
    },
    "no-csstransformspreserve3d figurephotostack-showback photostack-back": {
        "display": "block"
    },
    "no-js photostack figure": {
        "boxShadow": "-2px 2px 0 rgba(0,0,0,0.05)"
    },
    "no-js photostack figure::after": {
        "display": "none"
    },
    "no-js photostack figure:nth-child(3n)": {
        "WebkitTransform": "translateX(-10%) rotate(5deg)",
        "transform": "translateX(-10%) rotate(5deg)"
    },
    "no-js photostack figure:nth-child(3n-2)": {
        "WebkitTransform": "translateY(10%) rotate(-3deg)",
        "transform": "translateY(10%) rotate(-3deg)"
    },
    "photostack-1 nav spancurrent": {
        "background": "#888",
        "WebkitTransform": "scale(0.61)",
        "transform": "scale(0.61)"
    }
});