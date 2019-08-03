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
		G.unitCategories.unshift({
			id:'market_category',
			name:'Market'
		});

		new G.Tech({
			name:'market_tech',
			displayName:'Markets',
			desc:'@unlocks [market]s<>[population,Traders] can settle in a piece of [land] to buy or sell items',
			icon:[0,0,"market_images",24,1],
			cost:{
				'insight':5,
				'culture':5
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
				'culture': 5
			},
			req:{'sedentism':true},
		});

		new G.Unit({
			name:'market',
			desc:'A [population, Trader] can sell or buy items.',
			icon:[0,1,"market_images"],
			cost:{},
			req:{'market_tech':true},
			use:{
				'worker':1,
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

		new G.Unit({
			name:'market2',
			desc:'A [population, Trader] can set a market in this piece of [land] to sell or buy items in bulks of 10 at once.',
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
	}
});