G.AddData({
	name:'Market mod',
	author:'Bruno Mussoi Mendonça',
	desc:'Adds markets that can buy or sell items',
	engineVersion:1,
	manifest:0,
	requires:['Default dataset*'],
	sheets:{
		'market_images':'https://brunosupremo.github.io/market_mod/market_images.png?v=2'
	},
	func:function() {
		G.unitCategories.unshift({
			id:'market_category',
			name:'Market'
		});

		new G.Tech({
			name:'market_tech',
			displayName:'Markets',
			desc:'@unlocks [trader_sell, Trading] <> [population,Traders] can settle in a piece of [land] to buy or sell more items',
			icon:[0,0,"market_images",24,1],
			cost:{
				'insight':5,
				'culture':15
			},
			req:{'sedentism':true},
			effects:[
			{
				type:'show context',
				what:['market_category']
			}
			]
		});

		new G.Res({
			name:'market_coin',
			displayName:'Coins',
			desc:'Market money used to buy and sell other goods.//Used by [population,Traders].//Can be stolen over time',
			icon:[0,0,"market_images"],
			category:'misc',
			tick:function(me,tick) {
				var toSteal=me.amount*0.01;
				G.lose(me.name,randomFloor(toSteal),'thief');
			},
		});

		new G.Trait({
			name:'traders',
			desc:'@Your people learn the tricks of trading, prices get 10% better, for both buying and selling',
			icon:[0,1,"market_images",24,1],
			chance:20,
			cost: {
				'culture': 15
			},
			req:{'sedentism':true},
		});

		let buy_modes = {
			'off':G.MODE_OFF,
			'herb':{
				name:'herbs',
				icon: [4,6],
				desc:'Buy [herb]s with [market_coin, Coins].'
			},
			'salt':{
				name:'salt',
				icon: [11,7],
				desc:'Buy [salt] with [market_coin, Coins].'
			},
		};
		let sell_modes = {};
		for (key in buy_modes) {
			if (key == 'off') {
				sell_modes[key] = G.MODE_OFF;
			}else{
				let new_desc = buy_modes[key].desc.replace("Buy", "Sell");
				new_desc = new_desc.replace("with", "for");
				sell_modes[key] = {
					name: buy_modes[key].name,
					icon: buy_modes[key].icon,
					desc: new_desc
				}
			}
		}

		let buy_effects = [
		{
			type:'convert',
			from:{'market_coin':1},
			into:{'herb':1},
			every:5,
			mode:'herb'
		},
		{
			type:'convert',
			from:{'market_coin':1},
			into:{'salt':1},
			every:5,
			mode:'salt'
		},
		{
			type:'mult',
			value:1.1,
			req:{
				'traders':true
			}
		}
		];

		let sell_effects = [];
		for (var i = 0; i < buy_effects.length; i++) {
			sell_effects[i] = {};
			for (key in buy_effects[i]) {
				if (typeof buy_effects[i][key] !== 'object') {
					sell_effects[i][key] = buy_effects[i][key];
				}else{
					if(key == 'req'){
						sell_effects[i][key] = {'traders':true}
					}
				}
			}
			for (key in buy_effects[i].from) {
				sell_effects[i].into = {};
				sell_effects[i].into[key] = buy_effects[i].from[key];
			}
			for (key in buy_effects[i].into) {
				sell_effects[i].from = {};
				sell_effects[i].from[key] = buy_effects[i].into[key];
			}
		}

		new G.Unit({
			name:'trader_buy',
			displayName:'Trader',
			desc:'A [population, Trader] that can buy items.',
			icon:[2,0,"market_images", 0,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
			},
			gizmos:true,
			modes: buy_modes,
			effects: buy_effects,
			category:'market_category',
		});
		new G.Unit({
			name:'trader_sell',
			displayName:'Trader',
			desc:'A [population, Trader] that can sell items.',
			icon:[1,0,"market_images", 0,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
			},
			gizmos:true,
			modes: sell_modes,
			effects: sell_effects,
			category:'market_category',
		});

		new G.Unit({
			name:'market2',
			displayName:'Bazaar',
			desc:'A [market2] is set in this piece of [land] to sell or buy items in bulks of 10.',
			icon:[1,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes:{
				'off':G.MODE_OFF,
				'buy herb':{
					name:'buy herbs',
					icon: [2,0, "market_images", 4,6],
					desc:'Buy [herb] at 1 [market_coin].'
				},
				'sell herb':{
					name:'sell herbs',
					icon: [1,0, "market_images", 4,6],
					desc:'Sell [herb] for 0.5 [market_coin].'
				},
			},
			effects:[
			{
				type:'convert',
				from:{'market_coin':10},
				into:{'herb':10},
				every:5,
				mode:'buy herb'
			},
			{
				type:'convert',
				from:{'herb':10},
				into:{'market_coin':5},
				every:5,
				mode:'sell herb'
			},
			{
				type:'mult',
				value:1.1,
				req:{
					'traders':true
				}
			}
			],
			category:'market_category',
		});

		new G.Unit({
			name:'market3',
			displayName:'Market',
			desc:'A [market3] is set in this piece of [land] to sell or buy 100 items at once.',
			icon:[2,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes:{
				'off':G.MODE_OFF,
				'buy herb':{
					name:'buy herbs',
					icon: [2,0, "market_images", 4,6],
					desc:'Buy [herb] at 1 [market_coin].'
				},
				'sell herb':{
					name:'sell herbs',
					icon: [1,0, "market_images", 4,6],
					desc:'Sell [herb] for 0.5 [market_coin].'
				},
			},
			effects:[
			{
				type:'convert',
				from:{'market_coin':100},
				into:{'herb':100},
				every:5,
				mode:'buy herb'
			},
			{
				type:'convert',
				from:{'herb':100},
				into:{'market_coin':50},
				every:5,
				mode:'sell herb'
			},
			{
				type:'mult',
				value:1.1,
				req:{
					'traders':true
				}
			}
			],
			category:'market_category',
		});
	}
});