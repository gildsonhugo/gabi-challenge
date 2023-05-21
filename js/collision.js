export function collide(s1, s2){
    var hit = false;

    var vetX = s1.centerX() - s2.centerX();
    var vetY = s1.centerY() - s2.centerY();

    var sumHalWidth = s1.halfWidth() + s2.halfWidth();
    var sumHalHeight = s1.halfHeight() + s2.halfHeight();

    if(Math.abs(vetX) <= sumHalWidth && Math.abs(vetY) <= sumHalHeight){
        hit = true;
    }

    return hit;
}