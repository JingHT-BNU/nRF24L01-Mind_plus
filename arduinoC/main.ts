//% color="#2196F3" iconWidth=50 iconHeight=40
namespace nRF24L01 {
    // 定义功率选项的枚举
    export enum Power {
        //% block="最小"
        MIN = "RF24_PA_MIN",
        //% block="低"
        LOW = "RF24_PA_LOW",
        //% block="高"
        HIGH = "RF24_PA_HIGH",
        //% block="最大"
        MAX = "RF24_PA_MAX"
    }

    export enum LEDstate {
        //% block="亮"
        ON = "HIGH",
        //% block="灭"
        OFF = "LOW"
    }

    //% block="无线电初始化 CE引脚 [CEPIN] CSN引脚 [CSNPIN]" blockType="command"
    //% CEPIN.shadow="dropdown" CEPIN.options="PIN_DigitalWrite"
    //% CSNPIN.shadow="dropdown" CSNPIN.options="PIN_DigitalWrite"
    export function radioBegin(parameter: any, block: any) {
        let ce = parameter.CEPIN.code;
        let csn = parameter.CSNPIN.code;

        Generator.addInclude('nRF24L01_RF24', '#include <RF24.h>');
        Generator.addObject(`radio`, `RF24`, `radio(${ce}, ${csn});`);
        Generator.addSetup(`radio.begin`, `radio.begin();`);
    }

    //% block="无线电设置地址长度 [LEN]" blockType="command"
    //% LEN.shadow="range" LEN.params.min=3 LEN.params.max=5 LEN.defl=5
    export function setAddressWidth(parameter: any, block: any) {
        let len = parameter.LEN.code;
        Generator.addCode(`radio.setAddressWidth(${len});`);
    }

    //% block="无线电功率 [POW]" blockType="command"
    //% POW.shadow="dropdown" POW.options="Power"
    export function setPALevel(parameter: any, block: any) {
        let pow = parameter.POW.code;
        Generator.addCode(`radio.setPALevel(${pow});`);
    }

    //% block="无线电开始写入, 地址 [ADR]" blockType="command"
    //% ADR.shadow="normal" ADR.defl="Node1"
    export function openWritingPipe(parameter: any, block: any) {
        let adr = parameter.ADR.code;
        Generator.addCode(`radio.openWritingPipe(${adr});`);
        Generator.addCode(`radio.stopListening();`);
    }

    //% block="无线电开始读取, 地址 [ADR]" blockType="command"
    //% ADR.shadow="string" ADR.defl="Node1"
    export function openReadingPipe(parameter: any, block: any) {
        let adr = parameter.ADR.code;
        Generator.addCode(`radio.openReadingPipe(0, ${adr});`);
        Generator.addCode(`radio.startListening();`);
    }

    //% block="创建状态数组 [NAME] 长度 [LEN]" blockType="command"
    //% NAME.shadow="normal" NAME.defl="data"
    //% LEN.shadow="number" LEN.defl="5"
    export function createArray(parameter: any, block: any) {
        let name = parameter.NAME.code;
        let len = parameter.LEN.code;
        Generator.addCode(`char ${name}[${len}];`);
    }

    //% block="状态数组 [NAME] 的第 [IND] 个数据是 [VAL] ？" blockType="boolean"
    //% NAME.shadow="normal" NAME.defl="data"
    //% IND.shadow="number" IND.defl="0"
    //% VAL.shadow="string" VAL.defl="1"
    export function checkArrayValue(parameter: any, block: any) {
        let name = parameter.NAME.code;
        let ind = parameter.IND.code;
        let val = parameter.VAL.code;
        let code = `( ${name}[${ind}] == ${val} )`;
        Generator.addCode([code, Generator.ORDER_UNARY_POSTFIX]);
    }

    //% block="将状态数组 [NAME] 的第 [IND] 个数据设为 [VAL]" blockType="command"
    //% NAME.shadow="normal" NAME.defl="data"
    //% IND.shadow="number" IND.defl="0"
    //% VAL.shadow="string" VAL.defl="1"
    export function setArrayValue(parameter: any, block: any) {
        let name = parameter.NAME.code;
        let ind = parameter.IND.code;
        let val = parameter.VAL.code;
        Generator.addCode(`${name}[${ind}] = ${val};`);
    }

    //% block="使引脚 [PIN] 的LED灯 [STATE]" blockType="command"
    //% PIN.shadow="dropdown" PIN.options="PINX" PIN.defl="PINX.P0"
    //% STATE.shadow="dropdown" STATE.options="LEDstate" STATE.defl="LEDstate.ON"
    export function controlLED(parameter: any, block: any) {
        let pin = parameter.PIN.code;
        let state = parameter.STATE.code;

        Generator.addSetup(`pinmode_${pin}`, `pinMode(${pin}, OUTPUT);`);
        Generator.addCode(`digitalWrite(${pin}, ${state});`);
    }

    //% block="引脚 [PIN] 的按钮按下？" blockType="boolean"
    //% PIN.shadow="dropdown" PIN.options="PINX" PIN.defl="PINX.P0"
    export function readButton(parameter: any, block: any) {
        let pin = parameter.PIN.code;

        Generator.addSetup(`pinmode_${pin}`, `pinMode(${pin}, INPUT_PULLUP);`);
        let code = `( digitalRead(${pin}) == LOW )`;
        Generator.addCode([code, Generator.ORDER_UNARY_POSTFIX]);
    }
}