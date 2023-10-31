export function agregarSeparadorMiles(num) {
    if (num !== 'undefine') {
        let partesNumero = num.toString().split('.');
        partesNumero[0] = partesNumero[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return partesNumero.join('.');
    }
    else {
        return null;
    }
}