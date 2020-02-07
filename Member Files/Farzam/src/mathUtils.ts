export default class MathUtils {
    public static midpoint(lat1, long1, lat2, long2, per): number[] {
        return [lat1 + (lat2 - lat1) * per, long1 + (long2 - long1) * per];
    }

    public static distance(x1, y1, x2, y2): number {
        const dx: number = x2 - x1;
        const dy: number = y2 - y1;

        return Math.sqrt(dx * dx + dy * dy);
    }

    public static angle(x1, y1, x2, y2): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }
}
