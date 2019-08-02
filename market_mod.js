G.AddData({
	name:'Market mod',
	author:'Bruno Mussoi Mendonça',
	desc:'Adds markets that can buy or sell items',
	engineVersion:1,
	manifest:0,
	requires:['Default dataset*'],
	sheets:{
		'market_images':'https://brunosupremo.github.io/market_mod/market_images.png'
	},
	func:function() {
		G.unitCategories.push({
			id:'market_category',
			name:'Market'
		});
		new G.Tech({
			name:'market_tech',
			displayName:'Markets',
			desc:'@unlocks [market]s<>[population,Traders] can set in a piece of [land] to buy or sell items',
			icon:[0,0,"market_images"],
			cost:{
				'insight':5,
				'culture':5
			},
			req:{'sedentism':true},
			effects:[{type:'show context', what:['market_category']}],
		});

		new G.Res({
			name:'market_coin',
			displayName:'Coin',
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
			icon:[20,1],
			chance:20,
			cost: {
				'culture': 5
			},
			req:{'sedentism':true},
		});

		new G.Unit({
			name:'market',
			desc:'A [population, Trader] can set a market in this piece of [land] to sell or buy items.',
			icon:[0,0,"market_images"],
			cost:{},
			use:{
				'worker':1,
				'land':1,
			},
			gizmos:true,
			modes:{
				'off':G.MODE_OFF,
				'buy herb':{
					name:'buy herbs',
					icon: [0,0, "market_images", 4,6],
					desc:'Buy [herb] at 1 [market_coin].'
				},
				'sell herb':{
					name:'sell herbs',
					icon: [0,0, "market_images", 4,6],
					desc:'Sell [herb] for 0.5 [market_coin].'
				},
			},
			effects:[
			{
				type:'convert',
				from:{'market_coin':1},
				into:{'herb':1},
				every:5,
				mode:'buy herb'
			},
			{
				type:'convert',
				from:{'herb':1},
				into:{'market_coin':0.5},
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