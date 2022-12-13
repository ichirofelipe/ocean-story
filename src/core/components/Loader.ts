import * as PIXI from 'pixi.js';
const WebFont = require('webfontloader');
import gsap from 'gsap';
const {Howl, Howler} = require('howler');

export default class Loader {
    public loader: PIXI.Loader;
    private app: PIXI.Application;
    private loadingScreen: PIXI.Sprite;
    private container: PIXI.Container;
    private btncontainer: PIXI.Container;
    private loadingon: PIXI.Sprite;
    private loadingoff: PIXI.Sprite;
    private text: PIXI.Text;
    private btn1: PIXI.Sprite;
    private btn2: PIXI.Sprite;
    private bgm: Array<any> = [];
    private sounds: (type: Boolean, bgm: Array<any>) => void;
    private onAssetsLoaded: () => void;

    constructor(app: PIXI.Application, onAssetsLoaded: () => void, sounds: (type: Boolean, bgm: Array<any>) => void) {
        this.app = app;
        this.loader = app.loader;
        this.container = new PIXI.Container();
        this.btncontainer = new PIXI.Container();
        this.onAssetsLoaded = onAssetsLoaded;
        this.sounds = sounds;
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
        this.createLoadingScreen(this.app.screen.width, this.app.screen.height);
        this.loadAssets();
        this.loader.onProgress.add(() => {
            if(this.loadingon.width <= 295){
                this.loadingon.width += this.getRandomInt(1,5);
            }
        });
        this.loader.load(() => {
            this.loadingon.width = 295;
            this.fadeInOut(this.loadingon, 0, .3);
            this.fadeInOut(this.loadingoff, 0, .3);
            let stopper = setTimeout(() => {
                this.fadeInOut(this.text, 1, 1);
                this.fadeInOut(this.btncontainer, .5, .2);
                clearTimeout(stopper);
            }, 100);
        });
    }

    private fadeInOut(sprite: any, value: number, duration: number){
        let gsapper = gsap.to(sprite, {
            alpha: value,
            duration: duration,
            onComplete: () => {
                gsapper.kill();
            }
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
        this.loader.add('fishes', 'assets/images/scene/animations/fishes/fishes.json');
        
        //HOME
        this.loader.add('coconut', 'assets/images/scene/animations/coconut/coconut.json');
        this.loader.add('gabi', 'assets/images/scene/animations/gabi/gabi.json');
        this.loader.add('bird', 'assets/images/scene/animations/bird/bird.json');
        this.loader.add('homebonus', 'assets/images/home/bonus/bonus.json');
        this.loader.add('clam-white', 'assets/images/home/bonus/clam-white/clam-white.json');
        this.loader.add('clam-gold', 'assets/images/home/bonus/clam-gold/clam-gold.json');
        this.loader.add('clam-black', 'assets/images/home/bonus/clam-black/clam-black.json');
        
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
        
        //REEL ANIMATION
        this.loader.add('reelEffectBg', 'assets/images/slot/reel-effect-bg/reel-effect-bg.json');
        this.loader.add('reelEffectLines', 'assets/images/slot/reel-effect-lines/reel-effect-lines.json');

        
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
        
        //POPUPS
        this.loader.add('mega_win', 'assets/images/popups/mega_win/mega_win.json');
        this.loader.add('big_win', 'assets/images/popups/big_win/big_win.json');
        this.loader.add('coin', 'assets/images/popups/coin/coin.json');
        this.loader.add('popups', 'assets/images/popups/popups.json');
        
        //splash spinall no spin
        this.loader.add('splash', 'assets/images/plinko/splash.json');
        this.loader.add('spinall', 'assets/images/plinko/spinall.json');
        this.loader.add('nospin', 'assets/images/plinko/nospin.json');

        //new plinko
        this.loader.add('newplinko', 'assets/images/plinko/newplinko.json');

        //music index 0
        this.setUpSounds('assets/sounds/bgm.mp3', true);
        this.setUpSounds('assets/sounds/seashore.mp3', true);
        this.setUpSounds('assets/sounds/bonus-exit-transition.mp3', false);
        this.setUpSounds('assets/sounds/under-water-draft.mp3', true);
    }

    private createLoadingScreen(appWidth: number, appHeight: number) {
        const logo = PIXI.Sprite.from('assets/images/loading/logo.png');
        logo.width = 277;
        logo.height = 19;
        logo.position.x = (appWidth / 2) - (logo.width / 2);
        logo.position.y = appHeight * .4;
        this.loadingoff = PIXI.Sprite.from('assets/images/loading/loadingoff.png');
        this.loadingoff.width = 277;
        this.loadingoff.height = 6;
        this.loadingoff.position.x = (appWidth / 2) - (this.loadingoff.width / 2);
        this.loadingoff.position.y = logo.position.y + logo.height + 20;
        this.loadingon = PIXI.Sprite.from('assets/images/loading/loadingon.png');
        this.loadingon.width = 295;
        this.loadingon.height = 24;
        this.loadingon.position.x = (appWidth / 2) - (this.loadingon.width / 2);
        this.loadingon.position.y = logo.position.y + logo.height + 11;
        this.loadingScreen = PIXI.Sprite.from('assets/images/loading/bg.png');
        this.loadingScreen.width = appWidth;
        this.loadingScreen.height = appHeight;
        this.loadingon.width = 1;
        const style = new PIXI.TextStyle({
            fontFamily: 'Questrial',
            fontSize: 15,
            fill: '#ffffff',
        });
        this.text = new PIXI.Text('Do you want to play with sound?', style);
        this.text.x = (appWidth - this.text.width) / 2;
        this.text.y = logo.position.y + logo.height + 15;
        this.text.alpha = 0;
        
        this.btn1 = PIXI.Sprite.from('assets/images/loading/btnenable.png');
        this.btn1.width = 111;
        this.btn1.height = 31;
        this.btn1.interactive = true;
        this.btn1.buttonMode = true;
        this.btn1.addListener("pointerdown", () => {
            this.startgame(true)
        });

        this.btn2 = PIXI.Sprite.from('assets/images/loading/btndisable.png');
        this.btn2.width = 111;
        this.btn2.height = 31;
        this.btn2.position.x = this.btn1.width + 20;
        this.btn2.interactive = true;
        this.btn2.buttonMode = true;
        this.btn2.addListener("pointerdown", () => {
            this.startgame(false)
        });

        this.btncontainer.addChild(this.btn1);
        this.btncontainer.addChild(this.btn2);
        this.btncontainer.position.y = this.text.y + this.text.height + 15;
        this.btncontainer.position.x = (appWidth / 2) - ((this.btn1.width + this.btn2.width + 20) / 2);
        this.btncontainer.alpha = 0;

        this.container.addChild(this.loadingScreen);
        this.container.addChild(logo);
        this.container.addChild(this.loadingoff);
        this.container.addChild(this.loadingon);
        this.container.addChild(this.text);
        this.container.addChild(this.btncontainer);
        this.app.stage.addChild(this.container);
    }

    private startgame(play: Boolean){
        this.app.stage.removeChild(this.container);
        this.onAssetsLoaded();
        console.log(play)
        this.sounds(play, this.bgm);
    }

    private getRandomInt(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    private setUpSounds(music: any, loop: Boolean){
        const sound = new Howl({
            src: [music],
            loop: loop,
            volume: 1
        });
        this.bgm.push(sound);
    }
}
