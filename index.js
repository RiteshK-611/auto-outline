const { SVGPathData } = require("svg-pathdata");
const cheerio = require("cheerio");
const quadratic = require("adaptive-quadratic-curve");
const robot = require("robotjs");
const fs = require("fs");
const potrace = require("potrace");
const express = require("express");
const multer = require("multer");

const port = process.env.PORT || 8080

var pathToFile

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname)
  }
})

const upload = multer({ storage });

const app = express();
app.use(express.static('public'));

app.post("/upload" , upload.single('image'), async (req, res) => {
  // return res.json({ status: "OK" })
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (res) {
    run()
  }
})

app.listen(port, () => console.log(`App is listening at port ${port}`))


const fileSys = () => {
  fs.unlink(pathToFile, function(err) {
    if (err) {
      throw err
    } else {
      // console.log("Successfully deleted the file.")
    }
  })
}

// setTimeout(fileSys(), 10000)

const offsetX = 100;
const offsetY = 180;

robot.setMouseDelay(2);

const trace = () => {
  const dir = './uploads'
  const files = fs.readdirSync(dir)

  let x = files[0]

  pathToFile = "./uploads/" + x;

  potrace.posterize(pathToFile, { steps: 1 }, async (err, svg) => {
    if (err) throw err;

    fs.writeFileSync("./output.svg", svg);
    const $ = cheerio.load(svg);

    $("path").each((i, elm) => {
      const d = elm.attribs.d;
      const pathData = new SVGPathData(d);
      let current = pathData.commands[0];
      robot.moveMouse(current.x + offsetX, current.y + offsetY);
      robot.mouseToggle("down");

      for (let command of pathData.commands) {
        if (command.type === SVGPathData.MOVE_TO) {
          robot.mouseToggle("up");
          robot.moveMouse(command.x + offsetX, command.y + offsetY);
          robot.mouseToggle("down");
        } else if (command.type === SVGPathData.CURVE_TO) {
          robot.moveMouse(command.x1 + offsetX, command.y1 + offsetY);
          const points = quadratic(
            [command.x1, command.y1],
            [command.x, command.y],
            [command.x2, command.y2],
            1
          );
          for (let [x, y] of points) {
            robot.dragMouse(x + offsetX, y + offsetY);
          }
        } else if (command.type === SVGPathData.LINE_TO) {
          robot.dragMouse(command.x + offsetX, command.y + offsetY);
        }
      }
      robot.mouseToggle("up");
    });
  });
};

const run = () => {
  trace();
  fileSys();
};

// setTimeout(run, 15000);