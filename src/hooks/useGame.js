/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

import { useSprite } from "../model/Sprite";

const useGame = () => {
  const [playerOneHealth, setPlayerOneHealth] = useState(100);
  const [playerTwoHealth, setPlayerTwoHealth] = useState(100);

  const canvasRef = useRef(null);

  const { Sprite } = useSprite();
  const veloWalk = 5;
  const veloJump = 20;

  const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
  }

  useEffect(() => {
    initCanvas();

    const { player1, player2, ctx } = initPlayers();

    animate(player1, player2, ctx);

    initEventListener(player1, player2);
  }, []);

  const initEventListener = (player1, player2) => {
    window.addEventListener('keydown', onKeydown(player1, player2));
    window.addEventListener('keyup', onKeyup(player1, player2));
  };

  const onKeydown = (player1, player2) => (e) => {
    // console.log(e.key, '<< key')
    switch (e.key) {
      // player 1
      case 'a':
        keys.a.pressed = true;
        player1.lastKey = 'a';
        break;
      case 'd':
        keys.d.pressed = true;
        player1.lastKey = 'd';
        break;
      case 'w':
        player1.velo.y = -veloJump;
        break;
      case ' ':
        player1.attack();
        break;
      //  player 2
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        player2.lastKey = 'ArrowLeft';
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        player2.lastKey = 'ArrowRight';
        break;
      case 'ArrowUp':
        player2.velo.y = -veloJump;
        break;
      case 'Enter':
        player2.attack();
        break;
      default:
        break;
    }
  };

  const onKeyup = (player1, player2) => (e) => {
    switch (e.key) {
      // player 1
      case 'a':
        keys.a.pressed = false;
        break;
      case 'd':
        keys.d.pressed = false;
        break;
      // player 2
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        break;
      default:
        break;
    }
  }

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');

    canvas.width = 1024;
    canvas.height = 576;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const initPlayers = () => {
    const ctx = canvasRef.current.getContext('2d');

    const player1 = new Sprite({
      velo: { x: 0, y: 4 },
      pos: { x: 0, y: 0 },
      height: 150,
      color: 'red',
      attColor: 'blue',
      offset: { x: 0, y: 0 }
    });

    const player2 = new Sprite({
      velo: { x: 0, y: 4 },
      pos: { x: 500, y: 100 },
      height: 150,
      color: 'green',
      attColor: 'purple',
      offset: { x: -50, y: 0 }
    });

    return { player1, player2, ctx }
  };

  const rectangularCollision = (rect1, rect2) => {
    return (rect1.attackBox.pos.x + rect1.attackBox.width >= rect2.pos.x)
      && (rect1.attackBox.pos.x <= rect2.pos.x + rect2.width)
      && (rect1.attackBox.pos.y + rect1.attackBox.height >= rect2.pos.y)
      && (rect1.attackBox.pos.y <= rect2.pos.y + rect2.height)
  };

  const animate = (player1, player2, ctx) => {
    window.requestAnimationFrame(() => animate(player1, player2, ctx));

    const canvas = canvasRef.current;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player1.update(ctx, canvas);
    player2.update(ctx, canvas);

    // handle movement
    player1.velo.x = 0;
    if (keys.a.pressed && player1.lastKey === 'a') {
      player1.velo.x = -veloWalk;
    } else if (keys.d.pressed && player1.lastKey === 'd') {
      player1.velo.x = veloWalk
    }

    player2.velo.x = 0;
    if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
      player2.velo.x = -veloWalk;
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
      player2.velo.x = veloWalk
    }

    // detect collision
    if (rectangularCollision(player1, player2) && player1.isAttacking) {
      player1.isAttacking = false;
      console.log('P1 Attacking');
    }
    if (rectangularCollision(player1, player2) && player2.isAttacking) {
      player2.isAttacking = false;
      console.log('P2 Attacking');
    }
  };

  return { canvasRef, playerOneHealth, playerTwoHealth };
};

export { useGame };
