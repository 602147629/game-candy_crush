namespace pages {
	export class Game1Page extends Game  {

		constructor() {
			super();
		}

		protected get groupList(): string[] {
			return ["page-game1"];
		}

		public nextPage()
		{
			new Game2Page();
		}

		public onAddedToStage(event: egret.Event) : void {
			super.onAddedToStage(event);

			let bgSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('bg_png');
			this.addChild(bgSprite);

			this.scorebarSprite = new pages.game.ScorebarSprite();
			this.scorebarSprite.stageNumber = 1;
			this.addChild(this.scorebarSprite);

			let frameSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI("game1_frame_png");
			frameSprite.x = 21;
			frameSprite.y = 373;
			this.addChild(frameSprite);

			let gameUI = new ui.GameUI(60);
			gameUI.x = 31;
			gameUI.y = 381;
			gameUI.width = 689;
			gameUI.height = 689;
			gameUI.blocks = [/*0, 1, 8, 9, 6, 7, 14, 15, 48, 49, 56, 57, 54, 55, 62, 63, 27, 28, 35, 36*/];
			this.addChild(gameUI);

			network.todayRemaining().then(remaining => {
				if (remaining <= 0)
				{
					let maskUI = new layer.ui.MaskUI();
					this.addChild(maskUI);

					let tips = new layer.ui.BitmapUI('out-tips_png');
					tips.x = this.stage.stageWidth / 2 - tips.width / 2;
					tips.y = this.stage.stageHeight / 2 - tips.height / 2;
					this.addChild(tips);
				}
				else
				{
					this.readySprite.animating().then(() => {
						gameUI.start();
					});
				}
			})
			
		}

		protected onGameStop(event: GameEvent) : void {
			super.onGameStop(event);

			network.scoreQuery(event.score, 1).then(json => {
				let nextStageSprite: game.NextStageSprite = new game.NextStageSprite(json.data.score, this.nextPage);
				this.addChild(nextStageSprite);
			});
		}
	}
}
