import handlebars from 'handlebars';
import fs from 'fs';

function buildEmailTemplate(replacements: object){
    return fs.readFile(__dirname + '../../build/mail.html', (err, html) => {
        if (err) {
            return console.log(err);
        }
        const template = handlebars.compile(html);
        return template(replacements);
    });
}

export default buildEmailTemplate;