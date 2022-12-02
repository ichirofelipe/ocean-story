import * as PIXI from 'pixi.js';
import MenuButton from './Controllers/MenuButton';
import DownButton from './Controllers/DownButton';
import UpButton from './Controllers/UpButton';
import BetBox from './Controllers/BetBox';
import GameBox from './Controllers/GameBox';
import DropBox from './Controllers/DropBox';
import PlayButton from './Controllers/PlayButton';
import MinusButton from './Controllers/MinusButton';
import PlusButton from './Controllers/PlusButton';
import VolumeButton from './Controllers/VolumeButton';
import BalanceBox from './Controllers/BalanceBox';
import WinBox from './Controllers/WinBox';
import Modal from './Modal';

export default class Controllers {
    public container: PIXI.Container;
    private app: PIXI.Application;
    public menubutton: MenuButton;
    public downbutton: DownButton;
    public upbutton: UpButton;
    public gameinbox: GameBox;
    private game: number;
    private money: number;
    private win: number;
    private drop: number;
    public betbox: BetBox;
    public winbox: WinBox;
    public balancebox: BalanceBox;
    public dropbox: DropBox;
    private bet: number;
    public playbutton: PlayButton;
    public minusbutton: MinusButton; 
    public volumebutton: VolumeButton; 
    public plusbutton: PlusButton; 
    private labelstyle: PIXI.TextStyle;
    private valuestyle: PIXI.TextStyle;

    constructor(app: PIXI.Application, container: PIXI.Container, bet: number, game: number, drop: number, money: number, win: number) {
        this.app = app;
        this.container = container;
        this.bet = bet;
        this.game = game;
        this.drop = drop;
        this.money = money;
        this.win = win;
        this.labelstyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 9,
            fontWeight: 'bold',
            fill: '#FFE850'
        });
        this.valuestyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 13,
            fontWeight: 'bold',
            fill: '#ffffff'
        });
        this.init();
    }

    private init() {
        this.createBetBox();
        this.createGameBox();
        this.createPlayBox();
        this.createDropBox();
        this.createMinusButton();
        this.createPlusButton();
        this.createMenuButton();
        this.createDownButton();
        this.createUpButton();
        this.createVolumeButton();
        this.createBalanceBox();
        this.createWinBox();
    }

    private createBalanceBox(){
        this.balancebox = new BalanceBox(this.app, this.container, this.money, this.valuestyle, this.labelstyle);
        this.container.addChild(this.balancebox.container);
    }

    private createWinBox(){
        this.winbox = new WinBox(this.app, this.container, this.win, this.valuestyle, this.labelstyle);
        this.container.addChild(this.winbox.container);
    }

    private createVolumeButton(){
        this.volumebutton = new VolumeButton(this.app, this.container);
        this.addEvent(this.volumebutton.sprite);
        this.container.addChild(this.volumebutton.container);
    }

    private createDropBox(){
        this.dropbox = new DropBox(this.app, this.container, this.playbutton, this.drop, this.labelstyle);
        this.container.addChild(this.dropbox.container);
    }

    private createMinusButton(){
        this.minusbutton = new MinusButton(this.app, this.container, this.playbutton);
        this.addEvent(this.minusbutton.sprite);
        this.container.addChild(this.minusbutton.container);
    }

    private createPlusButton(){
        this.plusbutton = new PlusButton(this.app, this.container, this.playbutton);
        this.addEvent(this.plusbutton.sprite);
        this.container.addChild(this.plusbutton.container);
    }

    private createPlayBox(){
        this.playbutton = new PlayButton(this.app, this.container);
        this.addEvent(this.playbutton.sprite);
        this.container.addChild(this.playbutton.container);
    }

    private createMenuButton(){
        this.menubutton = new MenuButton(this.app, this.container);
        this.addEvent(this.menubutton.sprite);
        this.container.addChild(this.menubutton.container);
    }

    private createDownButton(){
        this.downbutton = new DownButton(this.app, this.container, this.betbox);
        this.addEvent(this.downbutton.sprite);
        this.container.addChild(this.downbutton.container);
    }
    
    private createBetBox(){
        this.betbox = new BetBox(this.app, this.container, this.bet, this.valuestyle, this.labelstyle);
        this.container.addChild(this.betbox.container);
    }

    private createGameBox(){
        this.gameinbox = new GameBox(this.app, this.container, this.game, this.valuestyle, this.labelstyle);
        this.container.addChild(this.gameinbox.container);
    }

    private createUpButton(){
        this.upbutton = new UpButton(this.app, this.container, this.betbox);
        this.addEvent(this.upbutton.sprite);
        this.container.addChild(this.upbutton.container);
    }

    private addEvent(button: PIXI.Sprite){
        button.addListener('mouseover', () => {
            button.alpha = .7;
        });
        button.addListener('mouseout', () => {
            button.alpha = 1;
        });
    }

}