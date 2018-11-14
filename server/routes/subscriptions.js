

export let subscriptions = [];


export const SUB_ROUTES = {

    POST:  {
        method: 'POST',
        path: '/subscriptions',
        handler: (request, h)  => {
            const sub = request.payload;
            console.log('[SUBSCRIPTION] New subscription: ', sub)
            subscriptions.push(sub);
            return h.response(sub);
        }
    },

}