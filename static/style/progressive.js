import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "progressive": {
        "position": "relative",
        "display": "block",
        "overflow": "hidden"
    },
    "progressive img": {
        "display": "block",
        "width": "100%",
        "maxWidth": "100%",
        "height": 188.16,
        "border": "0 none"
    },
    "progressive imgpreview": {
        "filter": "blur(2vw)",
        "transform": "scale(1.05)"
    },
    "progressive imghide": {
        "opacity": 0
    },
    "progressive imgorigin": {
        "position": "absolute",
        "left": 0,
        "top": 0,
        "animation": "origin 1.5s ease-out"
    },
    "progressive imgorigin-scale": {
        "position": "absolute",
        "left": 0,
        "top": 0,
        "animation": "origin-scale 1s ease-out"
    }
});