import Brambl from '../src/Brambl';
declare module NodeJS {
    interface Global {
        BramblJS: any;
    }
}
declare let BramblJS: any;
