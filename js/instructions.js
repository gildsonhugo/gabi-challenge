const instructions = [
    [ 
        'Olá Gabi! Seja muito bem vinda ao seu desafio.',
        'Esse jogo é 100% focado em você, e tem como objetivo entregar uma experiência interativa de como você faz bem ao criador dele.',
        'O personagem principal do jogo é você, e é controlado utilizando os direcionais esquerda/direita do teclado <img style="height: 30px;" src="./img/directionals.png">',
        'Você também pode realizar saltos utilizando a tecla espaço <img  style="height: 30px;" src="./img/space.png">'
    ],
    [ 
        'Seu personagem possui dois indicadores: Energia e força, posicionados no canto superior esquerdo.',
        'Ao realizar qualquer movimento (andar ou pular), você perde energia. Caso sua energia acabe, você não poderá realizar nenhum movimento até possuir a energia necessária pra isso (saltos consomem mais energia). A sua energia se recupera aos poucos caso você não realize nenhum movimento.',
        'Esse é o Hugo <img  style="height: 60px;" src="./img/hugo.png">. Ele ficará se movimentando pelo cenário querendo estar perto de você, mas não te perseguirá. Sempre que vocês estiverem próximos um do outro, a barra de amor do Hugo (canto superior direito) aumentará, porém seu indicador de força diminuirá. IMPORTANTE: VOCÊ NÃO PODE DEIXAR SUAS FORÇAS ACABAREM. CASO ISSO ACONTEÇA VOCÊ PERDERÁ O JOGO.',
    ],
    [
        'No cenário cairão alguns halteres, que caso você consiga pegar, recuperará uma porção da sua força.',
        'Ao estar próximo do Hugo, ele eventualmente liberará uma xícara de café, que caso você pegue, aumentará significativamente a sua energia, possibilitando você realizar mais movimentos.',
        'Seu objetivo está em fazer com que a barra de amor do Hugo chegue ao 100%, sem que suas forças acabem. Ao realizar isso, você vencerá o jogo e receberá seu prêmio.',
        'Está pronta para o desafio?'
    ]
];

const finalMessage = [
    'Você conseguiu!! Graças à sua capacidade incrível e por ser maravilhosa, o Hugo chegou ao nível mais elevado de amor por você.',
    'Esse jogo serviu para ilustrar um fato que já aconteceu há muito tempo, e que o Hugo não quer que acabe nunca, pois com sua companhia, sua capacidade de amar só aumenta, e a vontade de estar junto também.',
    'É por esse motivo que ele te mandou essa pergunta:'
]

const proposal = 'Gabriella, você aceita ser a minha namorada?'

export { instructions, finalMessage, proposal }