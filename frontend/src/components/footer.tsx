import { appStyleType } from '../interfaces';
import appStyle from '../styles/app.module.css';
const as = appStyle as appStyleType;

export default function Footer() {
    return (
        <footer className={`${as.banner} ${as.theFooter}`}>
            <a href="https://mal-noh.de/impressum" className={as.link} target="_blank" rel="noreferrer">Impressum</a>
            <p>© 2022 - <span className={as.secret}>Aron Malcher</span></p>
        </footer>
    );
}