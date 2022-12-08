import * as PIXI from 'pixi.js';
const WebFont = require('webfontloader');

export default class Loader {
    public loader: PIXI.Loader;
    private app: PIXI.Application;
    private loadingScreen: PIXI.Text;
    private onAssetsLoaded: () => void;

    constructor(app: PIXI.Application, onAssetsLoaded: () => void) {
        this.app = app;
        this.loader = app.loader;
        this.onAssetsLoaded = onAssetsLoaded;
        
        WebFont.load({
            google: {
              families: ['Libre Franklin', 'Questrial', 'Libre Franklin:900', 'Libre Franklin:500', 'Luckiest Guy', 'Montserrat']
            },
            active: () => {
                this.init();
            }
        });
        
    }

    private init() {
        this.loadAssets();
        this.createLoadingScreen(this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(this.loadingScreen);

        this.loader.load(() => {
            this.app.stage.removeChild(this.loadingScreen);
            this.onAssetsLoaded();
        });
    }

    private loadAssets() {
        this.loader.add('symbols', 'assets/images/symbols/symbols.json');
        this.loader.add('home', 'assets/images/home/home.json');
        this.loader.add('scene', 'assets/images/scene/scene.json');
        this.loader.add('slot', 'assets/images/slot/slot.json');
        this.loader.add('plinko', 'assets/images/plinko/plinko.json');
        this.loader.add('crane', 'assets/images/plinko/crane.json');
        this.loader.add('bottom', 'assets/images/scene/bottom/bottom.json');
        this.loader.add('controllers', 'assets/images/controllers/controllers.json');
        // this.loader.add('icons', 'assets/images/home/icons.json');

        //REEFS
        this.loader.add('plant-1', 'assets/images/scene/animations/plant-1/plant-1.json');
        this.loader.add('plant-2', 'assets/images/scene/animations/plant-2/plant-2.json');
        this.loader.add('plant-4', 'assets/images/scene/animations/plant-4/plant-4.json');
        this.loader.add('plant-5', 'assets/images/scene/animations/plant-5/plant-5.json');
        this.loader.add('plant-6', 'assets/images/scene/animations/plant-6/plant-6.json');
        this.loader.add('plant-7', 'assets/images/scene/animations/plant-7/plant-7.json');
        this.loader.add('plant-8', 'assets/images/scene/animations/plant-8/plant-8.json');

        //OCEAN BED
        this.loader.add('lightray', 'assets/images/scene/animations/lightray/lightray.json');
        
        //HOME
        this.loader.add('coconut', 'assets/images/scene/animations/coconut/coconut.json');
        this.loader.add('gabi', 'assets/images/scene/animations/gabi/gabi.json');
        this.loader.add('bird', 'assets/images/scene/animations/bird/bird.json');

        //SYMBOL ANIMATION
        this.loader.add('a', 'assets/images/symbols/animations/a/a.json');
        this.loader.add('j', 'assets/images/symbols/animations/j/j.json');
        this.loader.add('k', 'assets/images/symbols/animations/k/k.json');
        this.loader.add('bonus', 'assets/images/symbols/animations/bonus/bonus.json');
        this.loader.add('fish', 'assets/images/symbols/animations/fish/fish.json');
        this.loader.add('hermitcrab', 'assets/images/symbols/animations/hermitcrab/hermitcrab.json');
        this.loader.add('jackpot', 'assets/images/symbols/animations/jackpot/jackpot.json');
        this.loader.add('seahorse', 'assets/images/symbols/animations/seahorse/seahorse.json');
        this.loader.add('stingray', 'assets/images/symbols/animations/stingray/stingray.json');
        this.loader.add('turtle', 'assets/images/symbols/animations/turtle/turtle.json');
        this.loader.add('wild', 'assets/images/symbols/animations/wild/wild.json');
        
        //plinko animated characters
        this.loader.add('fish1', 'assets/images/plinko/fish1.json');
        this.loader.add('fish2', 'assets/images/plinko/fish2.json');
        this.loader.add('fish3', 'assets/images/plinko/fish3.json');
        this.loader.add('starfish1', 'assets/images/plinko/starfish1.json');
        this.loader.add('starfish2', 'assets/images/plinko/starfish2.json');
        this.loader.add('starfish3', 'assets/images/plinko/starfish3.json');
        this.loader.add('starfish4', 'assets/images/plinko/starfish4.json');
        this.loader.add('starfish5', 'assets/images/plinko/starfish5.json');
        this.loader.add('bomb', 'assets/images/plinko/bomb.json');
        this.loader.add('treasure', 'assets/images/plinko/treasure.json');
        this.loader.add('bottle', 'assets/images/plinko/bottle.json');

        //playbutton
        this.loader.add('playbutton', 'assets/images/home/playbutton.json');
        //splash spinall no spin
        this.loader.add('splash', 'assets/images/plinko/splash.json');
        this.loader.add('spinall', 'assets/images/plinko/spinall.json');
        this.loader.add('nospin', 'assets/images/plinko/nospin.json');

    }

    private createLoadingScreen(appWidth: number, appHeight: number) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Questrial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        const playText = new PIXI.Text('Loading...', style);
        playText.x = (appWidth - playText.width) / 2;
        playText.y = (appHeight - playText.height) / 2;
        this.loadingScreen = playText;
    }
}
