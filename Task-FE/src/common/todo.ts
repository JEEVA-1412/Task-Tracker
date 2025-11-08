export function getColor(status: string) {
    let color = "";

    // if (status == "started") {
    //   color = "blue";
    // } else if (status == "progress") {
    //   color = "red";
    // } else if (status == "completed") {
    //   color = "yellow";
    // } else {
    //   color = "black";
    // }

    switch (status) {
        case "started":
            color = "#64B5F6";
            break;
        case "progress":
            color = "#FFD54F";
            break;
        case "completed":
            color = "#81C784";
            break;
    }
    return color;
}