// Pixel-art avatar sprite + frame-by-frame renderer, ported from a standalone
// canvas animation the user provided. The drawing logic is tied to this
// exact sprite's pixel layout (row/column numbers below), so it's kept as a
// faithful port rather than rewritten — the only intentional changes are the
// idle-sway addition (see renderAvatarFrame) and dropping the "read the CSS
// --rim var every frame" bit in favor of a fixed accent color, since this
// app is always dark with one fixed accent.
export const AVATAR_SPRITE_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAABlCAYAAAAViFBwAAAaLElEQVR4nM2ceYzl2XXXP+fc33uvlq7t1dpmNB4nM8gmseJFxprMOB5ZduLMWMAAhlghWEiQGASIxQkxkYJDFG8BJBI0BkskKAHZkhU52J4ZJ7bsNsPM2MR2YhYhkSAcYma6a9+6lvf73Xv4497f9t6r7qqabitX6q6q33Lv/d5z7tl/F/6YNuecqardrf71bnX8kptZ/HeX2h9L4E7V1pYXERGyLLsr6LO70elLaapqS/15fPCYGRbCXRnnrgIXEcMMBDAwQARAUFW891I+65wzEWF5YRYfjPKGqhLuAni5/SOX6FTEAFaXFtI2Lbm1HC7+vbWzj/cBEXDOsTg/CyKE4NnY2kVECGZ3ZY53nOKdLLP+/CwliSOxZWiFBZHyH6wuLxJ8ZG0REBEMMDNU1QSp1qzJJS+l3VHh5lRtsQTdgNqcqQGWKC4iLPfnCSEgGsGZGVvbe3Scoipp4ayS8k7dHRF2t6V4KVXj1hTyPB+74ipiSwtzEVCCWu9pam5P94MZvW4XEWldv7G1gwCri32CWRRwiRNA2N7bRxErNZ0NbYXMxYUJFgjh7G1yS7bJsswEY3F+LlJid59gRgih9Z6qmpmxurTQAliN0LhmY7jBLF7d2z+kPz9bgQUiJwAhJKqLoCKEENjc2WusbNoiZqz257mxvXM54Jlz5pzGAYErUxOoKt1Oh63dfQYNygvY2soiFmqEFbwxFG8uwMgEErvvHxyRFwXBjLWlflJv1ByStIWUvybQLnOYGeub2/iLAs+yzIqiaN0TERMRVpf6BB9Y396p2ExVbHlhPlJnHMUbwM8EXD5rbR1gGOtbu4CxutiPFE4cUv4styFmOKe8uLGFU0dxC0E4VrgNg45jmIQQZGN7l0Geo4kFVdWcupoS0gAr6Y+WNpOK+6s1OpMrIjWXF+ZQUTZ392htFqkXUKi5QURvCbo55IVaFCDRNlEVJnoTOKdMdDsN/raa38cAGh54+Fpr0yQpubG1w/LifIPd4zJs7x7gva/Y/Ty6/1zqzKmWnpI5VQsh4H0ghJCEkBF8oLZVzgY9AkxaP8aQot7IS/05NrZ2W76LICzOz1YcGM7p2JyH4nZ1uY/3oZqwirC1u48Pnk6W0ck6zExPjgAbh6He623mGCZ3a90ae3pjZxdBWFlcGBmvbBvbuyOaZ7jdUo93ssx8CFGyl/spTUJVWUx6e7iNgG5s6vJeLfGborlGMMwsIvWelzGQmutnIeBU7FZS/UxWFxELZixXRkm6nliqPzfTkGNWTbL5s2H5tFi6zYwNMTfCpU2fXFrGzvA4zcVeXepzO2YeCzxzairC8sJcHKz6lyYwNHgT/ojQuoiB2XjZmqSX9mhNi1BGXwVgcWG2cpbGtRFWFxHzPnB1ZSkKr0bHLZ05ZlBDxlBT2NjeQUXx3qe9mXo6Q5QbxtHxgKnJblvjC2ROWeqn/S21IzTcVG4tt1t3syyzzCkrS/1KOrbU8i3YZ/zSCpvbu0x0uvS6nUryjn1xaAGOT07i5BvXb2zuNDjI2oO2JwrAyuICw3E7p2oqYiVwi9bXHIsL86141wigcoCK9Ufn3ZyDc4qqoqJI1LHV3SaGYRAqwo3N7WqxJQnX5f58++HmYI2NX3p0bowkDNHdVcucY3khuofNTTkW9Bl3K8IJrG/tsLmzSwgBFU1OiCHq2NzeHdmfdR9W2WXzczP1lhLh+sYWK0v92lYYN7nmIiRhuBjllDmnlmUuuc2QhRAkAFu7++ZDiBIxdbp/eIRzypWpiaFFloYcb+vcg4MjrkxP4VTY2tkjmJGJ4JOlJ7cwasq+mzg2tnfxIVRWWXO8dmc16zdFh2GsLvWx5POrCM7p6KbVhiTsZBkL8zPj92E5wtCvN49OMAucDgY88edfz+KVHj2n7B8PUJ/zrk98nZXFhZZqqi3c9oqoCC9ubNPrdliYi+5qcwqbO3ss9+erBRkFXfdjGBaMrb19isLLiFSPlhks9/vx4cquMMQaPDpEtVJdn56eIiIUPuBUue++ZYrTnCWDb/3hjcr4saZwatmvSahKrSEme70RahtQeM/uwSFzV6ZHMFT9oOkdYXN3r3JeWsBjfAuWWgLEWr9JqYbGtPXNHQTj4z/6IIXBcRHweYE6AROyiQkyp6xv7SQhdTbXl0BVJJrLZhWXlOBVhKLwlVVZ2+nGxtYuqpIcKaWIMb2KYSp1liURv7Qwh4WQ4DY2TcPkbK6stdY3brvTYNx77xLf+8BKAiBIptz7snk+/eOPYBa4sbmdKHKLZtEyOD49bdupSVgu9efx3nNyOmjMIo5XboFggbwoZCREVfWlwkp/oVq12iaWaCikfrd39yklI4kDmvtKEO6/dxEV0E6Xd/zSF/E+4DQ+95m/8f1kLsMHTxk8aO2chhEjoogqIsL2zh79hm9Qhq1VhcObR6gKmXO1kSnK8mKf9a0dzEbj8hXFxajU2fHJYMhKrPWE975hdzdlZ6R9MKM3OYHrdQEoghGAPIA3+KGPPsPU5CQOKqq32F1oCCsDUSYnejiN/ngz6iIiLC3ErMv+wc164Sz2EdXpeJ5qWW4GbO3uc3xykiZRv1QOFA2J2nip7bv68Rvr2zz2y1/mbf/884TGapcrLyL8+rsfQjA2tncq4yQ+056QJZ9/YnKKqclJNnf22N7ZiwKytHwNfAjkeYGZcTLIIziVM212bYzB1m7Uuz74BuuVOzlemZqcYGN7tyKTNDpYSTb07HSPEHzikzpxICiC8Ft/+2HuW5vl3//o9/O5v/kW1je3Kpau9XMpmIQiz9NUjG6ngwBb2zusb+2wsbVD5hzdTgcD8sJzePMoCsI0x3HWWy3lYmRFIOry5cX5ETNSEE4HOfs3j8CM5cWFmAxIC2dm7Ozt89zPPk5xcoI6xYkgohgBSetswVedbu/cZOPghL/+8a+QF4FSXEYpDU6FT//EI9w8LcCgo8LxwJNl8K5few5Vx0SvhyZuNDOOTk6wYCzMz5I55frmzkhgYuwGEBFbXYyCbozzxCAvOD0dkOc5M1em6GRZUilGJ4tm6Rf/wVtxWYbrdrGiqFVRCJGaItG5skAwY2v7iP3DU8yMwhuZwuxkh0EwpqcyECXrZPhBQW+iy2BQ8PZ/9QVcljE1MVltM+cc23t7qDp8UZBljrwYDTyeGYGppDuV8GWQF5XQ62QZInBw85jCezJVghkdJ3zhJx/lkV98mlJeF4Wv+i1zY8++7x1knQzLo2ReWpxmcWGKnb0TvA+YwJ/72DV8MLLMURSeLMswM778999GIVHtFIVv6Hdj/+AAp468KKSTZXZWpnUsxZ2q9edmKXyg03GJ3Bb3djV5pdPJyFS5eXJCR5Wn/+5bsSLnsX/9DM9+4WlElT/95rchGK9em6kG/G83buKc8mvv/D7ue8XVyKIpvBXMcN0ub3z/b/A9a7M4iZbkN68fgsHvPXuN73vwzfz233mER5+4hll8p78wz+7+QeKYSOHm9r0txZ1zRpWrim3/8Ca+KPjKP34HwcBCvP/Qh5+CLEMRPvWeN9PrdnnkX36Bbz53DXEZIe3lV6/NtLSAqBAM7v/xD1B8/pcoPanIXYLPBwhCprVj0skyfufa51Gn/K9v/g6vev2D+GD8h7/yIFjg3Z/4L2kRagrfKuDYUmfOOevPzTI/e4VB4TGMg8MjfFHwH9/zSLXn1SmG8OTfeitFiHp9YXYaVeO/fvWZ6AU5RaVhVKQxarVldCemkTJSUhoeGoMPr71nDsGqbRZCoNPppP4EC55ff9cbqyKCEOy2icIzKe69l739QxOMrNNhanKCo6NjnvgLr2NxfgpfeEBwvR42GNCfn+DL//Dt/MEfbZI5xRc5D7z6tZgv4ooXA0QElSihNYHIsoydnR3EAr/36RDBlguSXND/cf2QV65MxTVJC/dd3/saJHgCMRvqnLIwN83MzMR5sJ4NHGBQxGTgwHvzwYMFvucVywCoOr59fZ+j420UeOC7l8kyx6tesZLuNwBYqHTzbC9L4K3y/vpz82zeeKExcnIdkzOSe8/CRAcwFEOdQ8SBeUQdIMzMTDM3N4W36EXews0faWdG5MxMisJThACi1d685+osS/1pVIzf/9/rgGEpICCikBZLDEQzfIxxV9pABfJBzsB7sonJpONpuakxQxOXotTnIQSCLyCxuYiwMNujKIqkRscEFy4DHKDwPhqomqwvjdGLzAlLSzPce88CPiRzQwTU8Y0P/dXI6mkxnCodp/ikFwVh4CM3qCqWIqXRvi6BG1mW4ZQqkRAtOUNUmZqdI1hAnCJiPPzBz3KSe7lIvcxtc2cuc3zzD24k9oqT6C/N8mc++qWkfiK1nHNgAYLnGx/8sSjVT4/Z393m2v/Z5flvH/C1F4/4yv87igIK4es//y5ozjV5gyqCw7j2rT2e+cN9nv/2IT4Esk7G13/unXz1n7wzClk8b/lnv9V2Wc/ZzvWGithX3v94DCoI+DznNT/7G/zuz78Tl3X51u//EQ+86l58XkTqqBKKArNANjGFHwwqZyLuWanCZTEaE9qhFaLUL/I8qrXMQRKQAG/68FP4EAgGnU5Gno+mte8IcIBet2NixrX3vi16Qa6LYLz1X/w2uRnPvfcHUZdFUxQoUxEiLgo6auAlyHFxdiGqs+B9o7jPUHVRDohA8Dz4wadfUinYhV9UwTR5+6WXHiSSwylc+6lHcU6jK00Zw0sCLEV2SkNFtH6unI1ZSA5hLaNT2RcGPPSBz6IqDMbY3xfCcdEXgiFFMCl8kNwHGfgg3geyLCMg/MCHnixnG7FUMYxQBzAkVjY+8sHPRCcloS8dFl9mZ0t3Nnldj3z4syC8ZNBwCYqf1TpZZtGCimbqM+/9QaTTiRmU0lxtKNpgxls+8hQBUthYqmDmF9/7Q7iOixEvEUJR8KaPfK5clDsy5zsGvGxl6ZdLauj59z2WAnhasTiksHWni89zWqnGZplXCLhulze8/1Ox9vU2yf6LtDsOvGydLLPorgo+xb6u/eQPk6mgLpZkVcHGZMuWl0QdxWDAm37xc6R6Vry/c6DhLgIvWydzlhcxDJW5mEdzIpjAMz/9WIonJn86eYUPfeDJ6HyI3FEqN9tdB558Yj72+OuYdMLOIPD3PvO7MdzcCNtHZyZyB9w9wGW764X6RtzvEw5OQ6Crwr95/HUEg5/41DdwKsndjerNGC0ZvRvtO0Lx5/7Ro5jAf/+fLyACmUKeolGTHeXHPvm1Mq/wHWt3/ZsUFWF6ukc3E17zqqtMdR0+xOsd1/bKvpPtrgFPta8mAqfHx5gPoMorX3kPL39Zn4lMUXUMLHpvgN2qWOeOz+9OdeScM7NQOR7OOWZmrnBwcEhRFCjG8z/zDkDwRShVVBJsysMfeZKOc9FfD9FEHVdTe6fanejYNEVa5mdn2d3fZ2Z6Ota9qNDpdgkhRlA21m/w/Psei0HBlK0J3vPwRz6Hc47+wgI3bx5yOsirGvbSTr9Tn2SU7dKdOedMRZLjAaurqwTvYyAypEL7FIaGyAUbGxtVasnMUqUCeDOurl3FF0XDuoONzc0YlMwyBkVxR6X9pToqCwgQWF1eSUWA5YSbTnX6rSz+SWbriy++UA0tIlxdWwXAF3HhZKhGLYTAi9evk2XZHWP/y3RiqsrLrl5NBTVap27L1YiPjQ5TFuNWUYf6bjNjI0Nvl7H1jc1NQvB3xHy9UAfOOVNgcXERl+Lb7bDPGLBntOYHNmPuDpWC1gt1/fr1VGPzHfTHQwgsLi1VBQAx/DysgSoHfORq628Z/xwwRq+XHp2xurKCkTI+L6FdCLhZDCo6VZwqB/sH7OzsNCoYhpm0PfcysABl/m3oX/Vs8wMuqILmaZzg/Uv+7PJCwLWMn6cw0OzcXEoipNiw1RON1Q9lYLjdxu6ORpS6ebmktKWODGN5ebmVvLhMO/fbImJra2uNeFhUR7Nzs+zu7Jah8ViW4T2D08EItnqv1mxe3SuZZQzDHB0dVSUo3sccmhCzuhfA2mrnB17+rMhVx02CDc1YIE/lG2cb4o2YHDU3D78T8/KDqohncHqKhcDy8vK5vz8Z184N3CXrLM62nFwMFrgqnWvJMFGKoqAl6AzaTF8GH9Jf1WNtMGWBX1nFNDk11ZABl2/nBh4alYVphvGHGd1eL1lrVMZMFD4NTpDGS43rrcvpSouQIgzyHB88x8fH1TuWZMplHZtzARcRW11ZqSdatjLn5QOHh4dglpIEwsnJSQtQDcbasjAxRfN+S/ZZ+YmXVItfJhbUuUtT/lzANcXBSQNKlcWP90WVTqdDnucUqdasondDDVWi4FZ2D4yoAYG4dRqaQ4DVlWXcJaX7ud6yFu8l52PMDPPEkr4o2neHdkiL2gzjlqH/oxA9PDioU0jplll0cC5zbMptgauILS8vJWejMftGax5gUeQFm1tbTQxjW5k0HC+YpX4m9eG9x6WMbbkgAiwuDNW+n7PdFriIkLmstsnOYEsLgdNBrFUvrSqzIZYeUlNDmnx4YJLFApCir7WNH28L3V73rNW7Zbst8FqgDBGwUilJyKgyOTGZkvexgCAfDMgHeZ0lHTJpR+26pj1QSu34V5bFgHCR57UKLJ80w+nFpPstgTtVu7q62rauquVuGiz15Hf39xGD+dk5fDrwog3sVj/LQZq/1n47QPAhRm+s5sDV1dULE/1M4E7VSqOlPpBhCECaY0jCDKjKNeqzHWRknRoeeOPakI6viN9G5IOvTjFodmsXRH4m8GBWuaDNiZlZmyMBda5+asjQUafDzhUjIFuXZdydIW/MGJZnsSrq/Ox+9ke1lOw16mJUc0z/NVdbRLgyNVXVq7UiLW0hccbIQzs/dV14X10v1WHzWJWrV9cioHOqtrHAVdXW1tYQUulVCLWJ2gQhbRaLBbRaUatTHXfSYN9GC8E4PTltdFo/2tTxmcsqlSmqWGUrRAGrKlWAc9xXnOPa2NyZU+H69esp8BCjpkvLy7HqIVFSkwVXqqXSNm+xeSn5jXakwSCYxxc+CkAov48dwwfG4mKf9Y31tFgBUMyKKOlr0R4X4Uxv8BzAfbCqbjWducD6+np1Eo8PRqYKqiwtLsYJqyLqsNAQdIwTY4IR8N5TFHmM3VV3aC1OydbOxUpGpy4Jt1AFIlSUb7/wAi7l3QfnjMWNBV7Gr7N0YgBifOJH3sD+IFDWD/Yy4d2f/Bo31iMl+vPzWFm/AlUwsiR2vRJGkRfkeY6K0JuYYKw6k5r/SwKUe/rm0RHBAnv7+/EJEYoLRl5vqcfzopAQgogIRUhlkypkLnLBxx5/HRB/397dwXtffbc9MTHRgFFKauPk5KT6xkRGNuTo3CXtFRFhb3+Pw8MDLHg++mdfA8lKvEyi4dwvZKr2b//i65mf6WEGe4cnXJmaIIjwl//dM6gI3d4E3U4H51wEPqSm8zzH+6Ji306ng7rm2o8o/MrqCz6wtbnBE4+/lq7GTztOgvGeT36t3BUXahcIPUVfW5P1dmWqBxhdZ7GgHolRGlJxXlMNBkt7uqhqzzXVsta6e2juQw5MCAEfAt1MGXhjUJQm7eU88nNXRBjwp175J6pyrlJiqXN4iwaPSzZ75a2lZ4IZpycnrbr0siC/+rsxTnvU2IqUV5ub7rG6NIM4hypkTuIiXLCdm+LlF8BCmzVD4Xn2p38YEvBqyslkHZwOYoCw8Vav14vVj6mP6p2RX4QQjOOj48orW1uZQztZ2iLKx//aIxd2UOBCMTewKsBQnbBQJRmqqYrQ7fViTfpggE/ZVE2c0O31yLKMZriwvbOl4vyiKFqL5lyHhz78VK0lBO65OndhO/1CwAF2d44QhRhYauxBk8pYKY8gTNK2MiyqAUvHp3HNqv9r87DICwYn8Ts0S31Fhwk0cyVuCAWXibleKMr66Ee/hC9CbX3WyMmcsru/h5HiY0NNJBYJVH+Xr7fST2msEMjzfETdXZmexpcVUqW6L73kC7bzA09nSYjFTzXKSsQy9/2ffurt6XNp13rP0ieYIkK3242JgYYQL6ldyoQQPCcnJ23HBypXN3OKzweposLqBbxbwMspvOEXPgtIpV+jZSXx5DzG16BPTE1FC60E3VJVEbAvCganA45vHrXeDSkHXy7ewvwCb/yFJ7m+fkAI/tLZlAsV+PkQpJs529zapT83lSoXksYOhitLM0OgN1mf9hUL9aWKjDZbKfmrwMVQuDjLslRHE52gECKrK8b/ffGAq8vTlwJ/4aC0D8ZjT3wpOSVtVfTVn3mMrZ0dDDhOib4Y926Cbk9SROh0OnS6HXq9Ht1ul26vR6/Xo9PtknU6iEROUnXRW8QIBj0HL6wfXMqIuXBJZ0jhFNftEPK8NWjc8sbu/j7OOXq9HpJlyVE5a3JSRXCqj2NT5iF9N1stmAhsbmwhIgw8dNXoNT7DvEi7MMXNTESFB3/uN2kZH2bVl71ZlrG6tMTm9hbrG5tgpfoLI1RvxS8ZuldHO/CF5/r1G+Tes7qyyl/61Weiais7uGC7VBFvCCZB4ylg8fuTSBoVWFtd5cr0NCJCXhRsbm+zubkJCNPT00xNl2e2RMHYtAars1gjaixEe+Dw8JCbR0cs9vu4dAi1iJAj/Miv/GeGT/w4T7uchQ+IiGUqPPu+R4F4AsiD//Q3efnL74tBhBSWOj09pSg8NzbWq5i7irC0uITLXHy2OnQ2coaqMhjkbG1tRR9AhYW5eebm5qrU08HBAZtbm2UQ88I4Ll227VRBBV94xIwf+NBTPHD/A/EQS+8TeGEySfcrV66gKuzu7bG+ucn6xgZIPL/BlwabpaK/EMicI4TA2soKs7Oz1ancUf1B5hzlYdbDOfXztEsXkhTeS5EXPPzhp3GiFCH62yE0vzaqny+jKHOzczzwXd/Nn7z//jhtdZAAiwhrK6vx0w2BtZUVZmZm00GZdUQVjMmpqbo25hLt/wNX/gJpfHbAsgAAAABJRU5ErkJggg==';

export const AVATAR_SPRITE_WIDTH = 62;
export const AVATAR_SPRITE_HEAD_HEIGHT = 55;
export const AVATAR_SPRITE_BODY_HEIGHT = 88;
const OX = 5;
const OY = 8;
export const AVATAR_CANVAS_WIDTH = AVATAR_SPRITE_WIDTH + 10;
export const AVATAR_CANVAS_HEIGHT = AVATAR_SPRITE_BODY_HEIGHT + OY;

const SKIN = '#c87b4d';
const LINE = '#311b0e';
const ACCENT = '#22d3ee';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function smoothstep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

// Rises, holds, then falls back down over a gesture's lifetime.
function pulse(gt: number, up: number, hold: number, down: number): number {
  return smoothstep(gt / up) * (1 - smoothstep((gt - hold) / down));
}

export type AvatarGesture = 'hi' | 'nod' | 'wink' | 'jump' | 'tilt' | 'shake' | '';

export const AVATAR_MESSAGES: ReadonlyArray<readonly [AvatarGesture, string]> = [
  ['hi', '¡Hola! Soy Alejo'],
  ['nod', 'Desarrollador full-stack'],
  ['wink', 'Construí CodeQuest de punta a punta'],
  ['jump', '¡Gracias por usar la app!'],
  ['tilt', '¿Dudas o ideas? ¡Escríbeme!'],
  ['shake', 'Cero bugs hoy... espero'],
];

let cachedOffscreenA: HTMLCanvasElement | null = null;
let cachedOffscreenB: HTMLCanvasElement | null = null;

function getOffscreen(): [HTMLCanvasElement, HTMLCanvasElement] {
  if (!cachedOffscreenA || !cachedOffscreenB) {
    cachedOffscreenA = document.createElement('canvas');
    cachedOffscreenB = document.createElement('canvas');
    cachedOffscreenA.width = cachedOffscreenB.width = AVATAR_CANVAS_WIDTH;
    cachedOffscreenA.height = cachedOffscreenB.height = AVATAR_CANVAS_HEIGHT;
  }
  return [cachedOffscreenA, cachedOffscreenB];
}

// Draws a 1px cyan rim behind the sprite, matching the app's accent color
// (the original read a CSS var per frame for light/dark theming; this app is
// always dark with one fixed accent, so it's hardcoded instead).
function drawRim(ctx: CanvasRenderingContext2D): void {
  const [o1, o2] = getOffscreen();
  const a = o1.getContext('2d')!;
  const b = o2.getContext('2d')!;
  a.clearRect(0, 0, AVATAR_CANVAS_WIDTH, AVATAR_CANVAS_HEIGHT);
  a.drawImage(ctx.canvas, 0, 0);
  b.clearRect(0, 0, AVATAR_CANVAS_WIDTH, AVATAR_CANVAS_HEIGHT);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
    b.drawImage(o1, dx, dy);
  }
  b.globalCompositeOperation = 'source-in';
  b.fillStyle = ACCENT;
  b.fillRect(0, 0, AVATAR_CANVAS_WIDTH, AVATAR_CANVAS_HEIGHT);
  b.globalCompositeOperation = 'source-over';
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(o2, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
}

function rect(ctx: CanvasRenderingContext2D, x0: number, x1: number, y0: number, y1: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(x0, y0, x1 - x0 + 1, y1 - y0 + 1);
}

export interface AvatarRenderParams {
  t: number;
  gestureTime: number;
  gesture: AvatarGesture;
}

// Ported frame-by-frame from the original script, plus a slow idle sway
// (tilt/hx) added for the gap between gesture messages, so the avatar
// doesn't look frozen while waiting for the next line.
export function renderAvatarFrame(ctx: CanvasRenderingContext2D, sprite: HTMLImageElement, params: AvatarRenderParams): void {
  const { t, gestureTime: gt, gesture: g } = params;
  const HEAD = AVATAR_SPRITE_HEAD_HEIGHT;
  const SW = AVATAR_SPRITE_WIDTH;
  const SH = AVATAR_SPRITE_BODY_HEIGHT;
  const CW = AVATAR_CANVAS_WIDTH;
  const CH = AVATAR_CANVAS_HEIGHT;

  let jy = 0, hx = 0, hy = 0, tilt = 0, mouth = 0, lid = 0;
  let winkR = false;
  let matched = true;

  const breathe = Math.sin(t * 2.2) > 0.25 ? 1 : 0;
  const blinkT = t % 4.2;
  lid = blinkT > 4.0 ? (blinkT < 4.06 || blinkT > 4.14 ? 1 : 2) : 0;

  if (g === 'nod' && gt < 2.3) {
    hy = Math.round(Math.sin(Math.PI * ((gt / 0.55) % 1)) * 2);
  } else if (g === 'shake' && gt < 2.1) {
    const s = Math.sin(gt * Math.PI * 4);
    hx = Math.round(s * 2);
    tilt = Math.round(s * 1.4);
  } else if (g === 'tilt' && gt < 3) {
    const v = pulse(gt, 0.45, 2.2, 0.5);
    tilt = Math.round(3 * v);
    hx = Math.round(v);
  } else if (g === 'hi' && gt < 3) {
    const v = pulse(gt, 0.45, 2.2, 0.5);
    tilt = Math.round(3 * v);
    hx = Math.round(v);
    mouth = gt < 2.2 ? 1 + (Math.floor(gt * 9) % 2) : 0;
  } else if (g === 'wink' && gt < 3) {
    const v = pulse(gt, 0.35, 2.2, 0.4);
    tilt = -Math.round(2 * v);
    winkR = v > 0.5;
  } else if (g === 'jump' && gt < 1.9) {
    const ph = (gt % 0.62) / 0.62;
    const h = Math.round(4 * ph * (1 - ph) * 7);
    jy = -h;
    if (h === 0) {
      hy = 1;
    }
  } else {
    matched = false;
  }

  if (!matched) {
    // Idle sway: slow head tilt while no gesture is playing.
    tilt = Math.round(Math.sin(t * 0.6) * 1.2);
    hx = Math.round(Math.sin(t * 0.6 + 1) * 1);
  }

  ctx.clearRect(0, 0, CW, CH);
  const base = OY + jy;
  ctx.drawImage(sprite, 0, 70, SW, SH - 70, OX, base + 70, SW, SH - 70);
  ctx.drawImage(sprite, 0, 52, SW, 20, OX, base + 52 - breathe, SW, 20);

  const y0 = base + hy - breathe;
  for (let r = 0; r < HEAD; r++) {
    const sh = Math.round((tilt * (HEAD - 1 - r)) / (HEAD - 1)) + hx;
    ctx.drawImage(sprite, 0, r, SW, 1, OX + sh, y0 + r, SW, 1);
  }

  const row = (r: number, x0: number, x1: number, color: string) => {
    const sh = Math.round((tilt * (HEAD - 1 - r)) / (HEAD - 1)) + hx;
    rect(ctx, OX + sh + x0, OX + sh + x1, y0 + r, y0 + r, color);
  };
  const eye = (x0: number, x1: number, state: number) => {
    if (!state) {
      return;
    }
    for (let r = 35; r <= (state === 1 ? 38 : 42); r++) {
      row(r, x0, x1, SKIN);
    }
    if (state === 2) {
      row(40, x0 + 1, x1 - 1, LINE);
      row(39, x0 + 1, x0 + 1, LINE);
      row(39, x1 - 1, x1 - 1, LINE);
    }
  };
  eye(20, 30, lid);
  eye(38, 46, winkR ? 2 : lid);
  if (mouth) {
    row(48, 31, 34, LINE);
    if (mouth === 2) {
      row(49, 32, 33, LINE);
    }
  }

  drawRim(ctx);

  // Dithered fade-out on the bottom edge of the bust.
  const F = 12;
  const im = ctx.getImageData(0, CH - F, CW, F);
  const d = im.data;
  for (let y = 0; y < F; y++) {
    for (let x = 0; x < CW; x++) {
      const f = (y + 1) / F;
      if (BAYER[((y & 3) << 2) | (x & 3)] / 16 < f * f) {
        d[(y * CW + x) * 4 + 3] = 0;
      }
    }
  }
  ctx.putImageData(im, 0, CH - F);
}
