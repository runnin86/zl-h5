import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "iconfont": {
        "fontFamily": "\"iconfont\" !important",
        "fontSize": 16,
        "fontStyle": "normal",
        "WebkitFontSmoothing": "antialiased",
        "MozOsxFontSmoothing": "grayscale"
    },
    "icon-39liulanyulan:before": {
        "content": "\\e619"
    },
    "icon-icon:before": {
        "content": "\\e64c"
    },
    "icon-search:before": {
        "content": "\\e672"
    },
    "icon-back:before": {
        "content": "\\e608"
    },
    "icon-grid:before": {
        "content": "\\e62f"
    },
    "icon-9:before": {
        "content": "\\e67c"
    },
    "icon-footer:before": {
        "content": "\\e8ec"
    },
    "icon-header:before": {
        "content": "\\e8ed"
    },
    "icon-slider:before": {
        "content": "\\e727"
    },
    "icon-menu:before": {
        "content": "\\e634"
    },
    "icon-cell:before": {
        "content": "\\e62d"
    },
    "icon-dialog:before": {
        "content": "\\e643"
    },
    "icon-grid1:before": {
        "content": "\\e657"
    },
    "icon-widget-slider-scroll:before": {
        "content": "\\e67e"
    },
    "icon-buttonminus:before": {
        "content": "\\e602"
    },
    "icon-radiobuttonon:before": {
        "content": "\\e62e"
    },
    "icon-spinner:before": {
        "content": "\\e67d"
    },
    "icon-tab:before": {
        "content": "\\e902"
    },
    "icon-input:before": {
        "content": "\\e644"
    },
    "icon-iconfile:before": {
        "content": "\\e600"
    },
    "icon-switch-copy:before": {
        "content": "\\e601"
    },
    "icon-panel:before": {
        "content": "\\e721"
    },
    "icon-picture:before": {
        "content": "\\e6a7"
    },
    "icon-actionsort:before": {
        "content": "\\e6f5"
    },
    "icon-yduiindextabbar:before": {
        "content": "\\e705"
    },
    "icon-yduiindexbadge:before": {
        "content": "\\e710"
    },
    "icon-refreshindicatordark2x:before": {
        "content": "\\e60b"
    },
    "icon-icon7:before": {
        "content": "\\e637"
    },
    "icon-selectarrows:before": {
        "content": "\\e64f"
    },
    "icon-popup:before": {
        "content": "\\e680"
    },
    "icon-icon_status-progress-circle:before": {
        "content": "\\e63b"
    },
    "icon-amy-ui-textarea:before": {
        "content": "\\ed92"
    }
});