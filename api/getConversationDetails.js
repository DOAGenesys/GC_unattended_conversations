let platformClient = require('platformClient');

module.exports = async (req, res) => {
    const conversationId = req.query.conversationId;
    if (!conversationId) {
        return res.status(400).json({ error: 'conversationId is required' });
    }

    const conversationsApi = new platformClient.ConversationsApi();

    try {
        const conversationDetails = await conversationsApi.getAnalyticsConversationDetails(conversationId);
        res.json(conversationDetails);
    } catch (error) {
        console.error("Error fetching conversation details:", error);
        res.status(500).json({ error: 'Failed to fetch conversation details', details: error.toString() });
    }
};
