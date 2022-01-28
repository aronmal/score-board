export default function clock() {
    const h = new Date().getHours();
    const m = new Date().getMinutes();

    const hh = h < 10 ? "0" + h : h;
    const mm = m < 10 ? "0" + m : m;

    return `${hh}:${mm}`;
}