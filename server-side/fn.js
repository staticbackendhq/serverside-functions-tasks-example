function handle(body) {
    log("DEBUG: inside ssf", body);
    try {
        var msg = JSON.parse(body.data);
        msg.sentOn = new Date();
        var res = create("msgs_774_", msg);
        if (!res.ok) {
            log("unable to create msg", res.content);
            return;
        }
        log("success");
    } catch(ex) {
        log("error parsing data", ex);
    }
}
