import classNames from 'classnames';
import { as } from '../helpers/styles';

export default function Footer() {
    return (
        <footer className={classNames(as.banner, as.theFooter)}>
            <a href="https://mal-noh.de/impressum" className={as.link} target="_blank" rel="noreferrer">Impressum</a>
            <p>© 2022 - <span className={as.secret}>Aron Malcher</span></p>
        </footer>
    );
}