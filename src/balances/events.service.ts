import {Injectable} from '@nestjs/common';
import {fromEvent} from "rxjs";
import {EventEmitter} from "events";

@Injectable()
export class EventsService {

    private readonly emitter: EventEmitter;

    constructor(
        // Inject some Service here and everything about SSE will stop to work.
    ) {
        this.emitter = new EventEmitter();
    }

    subscribe(eventName:string) {
        return fromEvent(this.emitter, eventName);
    }

    async emit(eventName:string,data) {
        this.emitter.emit(eventName, {data});
    }

}
