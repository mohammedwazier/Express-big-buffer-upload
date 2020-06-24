const fsOld = require('fs')
const fs = require('fs-extra');
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const Busboy = require('connect-busboy');

const basename = path.basename(__filename)
const router = express.Router();

/*Initialize Source Path for Saving File*/
const uploadPath = path.join(__dirname, './Source/');
fs.ensureDir(uploadPath);
/*End Initialize Source Path*/

router.use(Busboy({
    highWaterMark: 100 * 1024 * 1024, // Set 100MiB buffer
})); // Insert the busboy middleware

router.get('/Index', (req, res) => {
	res.send({page: 'Upload', state: true});
})

router.post('/UploadFile', async (req, res) => {
	let response = {};

    req.pipe(req.busboy)

    let imageCount = 0;
    // var imageRespon = [];
    var dataSource = {};
    let listFile = [];

    req.busboy.on('file', (fieldname, file, filename, encoding, mime) => {
        let name= filename.split('.')
        let typeFiles = mime.split('/')
        name[0] = name[0].replace(/\s/g,'');
        name[0] = name[0].replace(/[^0-9a-z]/gi, '');
        name = `${Math.random()}_${name[0]}.${name[name.length-1]}`;

        const fstream = fs.createWriteStream(path.join(uploadPath, name))

        imageCount++;

        file.pipe(fstream);

        listFile.push(name);

        // if(!dataSource[fieldname]){
        // 	dataSource[fieldname];
        // }else{
        // 	dataSource[fieldname] = {
        // 		...dataSource[fieldname],
        // 		name
        // 	}
        // }

        // dataSource[fieldname] = name;

        fstream.on('close', () => {
            let size = fs.statSync(path.join(uploadPath, name));
            console.log(name, 'size', (size['size'] / 1048576))
            // dataSource[fieldname].push(name)
            // imageRespon.push({
            //     name: name,
            //     type: mime,
            //     size: (size['size'] / 1048576)
            // })
            file.unpipe(fstream);
        });

        fstream.on('error', (err) => {
            console.log('asdasdasd',err)
        })
    })

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        dataSource[fieldname] = val;
        console.log(dataSource)
    });


    req.busboy.on('finish', function(){
        req.unpipe(req.busboy);
        response.data = {
            fileLength: imageCount,
            fieldData: dataSource,
            file: listFile
            // image: imageRespon
        };
        response.code = 100;
        response.state = true;
        response.message = "Berhasil Upload File";
        res.send(response)

        // resolve(response);
    })

    req.busboy.on('error', function(){
        response.data = {};
        response.code = 101;
        response.state = false;
        response.message = "Gagal Upload File";
        res.send(response)
        // resolve(response);
    })
})


module.exports = router;