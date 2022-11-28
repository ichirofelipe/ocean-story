import * as PIXI from 'pixi.js';

export default class Loader {
    public loader: PIXI.Loader;
    private app: PIXI.Application;
    private loadingScreen: PIXI.Text;
    private onAssetsLoaded: () => void;

    constructor(app: PIXI.Application, onAssetsLoaded: () => void) {
        this.app = app;
        this.loader = app.loader;
        this.onAssetsLoaded = onAssetsLoaded;
        
        this.init();
        
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

        //REEFS
        this.loader.add('plant-1', 'assets/images/scene/animations/plant-1/plant-1.json');
        this.loader.add('plant-2', 'assets/images/scene/animations/plant-2/plant-2.json');
        this.loader.add('plant-4', 'assets/images/scene/animations/plant-4/plant-4.json');
        this.loader.add('plant-5', 'assets/images/scene/animations/plant-5/plant-5.json');
        this.loader.add('plant-6', 'assets/images/scene/animations/plant-6/plant-6.json');
        this.loader.add('plant-7', 'assets/images/scene/animations/plant-7/plant-7.json');
        this.loader.add('plant-8', 'assets/images/scene/animations/plant-8/plant-8.json');
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
