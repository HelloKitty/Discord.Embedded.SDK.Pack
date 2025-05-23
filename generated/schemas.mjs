import z from '../lib/zod/lib/index.mjs';
import { fallbackToDefault } from '../utils/zodUtils.mjs';

/**
 * This file is generated.
 * Run "npm run sync" to regenerate file.
 * @generated
 */
// INITIATE_IMAGE_UPLOAD
const InitiateImageUploadResponseSchema = z.object({ image_url: z.string() });
// OPEN_SHARE_MOMENT_DIALOG
const OpenShareMomentDialogRequestSchema = z.object({ mediaUrl: z.string().max(1024) });
// AUTHENTICATE
const AuthenticateRequestSchema = z.object({ access_token: z.union([z.string(), z.null()]).optional() });
const AuthenticateResponseSchema = z.object({
    access_token: z.string(),
    user: z.object({
        username: z.string(),
        discriminator: z.string(),
        id: z.string(),
        avatar: z.union([z.string(), z.null()]).optional(),
        public_flags: z.number(),
        global_name: z.union([z.string(), z.null()]).optional(),
    }),
    scopes: z.array(fallbackToDefault(z
        .enum([
        'identify',
        'email',
        'connections',
        'guilds',
        'guilds.join',
        'guilds.members.read',
        'guilds.channels.read',
        'gdm.join',
        'bot',
        'rpc',
        'rpc.notifications.read',
        'rpc.voice.read',
        'rpc.voice.write',
        'rpc.video.read',
        'rpc.video.write',
        'rpc.screenshare.read',
        'rpc.screenshare.write',
        'rpc.activities.write',
        'webhook.incoming',
        'messages.read',
        'applications.builds.upload',
        'applications.builds.read',
        'applications.commands',
        'applications.commands.permissions.update',
        'applications.commands.update',
        'applications.store.update',
        'applications.entitlements',
        'activities.read',
        'activities.write',
        'activities.invites.write',
        'relationships.read',
        'relationships.write',
        'voice',
        'dm_channels.read',
        'role_connections.write',
        'presences.read',
        'presences.write',
        'openid',
        'dm_channels.messages.read',
        'dm_channels.messages.write',
        'gateway.connect',
        'account.global_name.update',
        'payment_sources.country_code',
        'sdk.social_layer_presence',
        'sdk.social_layer',
        'lobbies.write',
    ])
        .or(z.literal(-1))
        .default(-1))),
    expires: z.string(),
    application: z.object({
        description: z.string(),
        icon: z.union([z.string(), z.null()]).optional(),
        id: z.string(),
        rpc_origins: z.array(z.string()).optional(),
        name: z.string(),
    }),
});
// GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS
const GetActivityInstanceConnectedParticipantsResponseSchema = z.object({
    participants: z.array(z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]).optional(),
        discriminator: z.string(),
        avatar: z.union([z.string(), z.null()]).optional(),
        flags: z.number(),
        bot: z.boolean(),
        avatar_decoration_data: z
            .union([
            z.object({ asset: z.string(), skuId: z.string().optional(), expiresAt: z.number().optional() }),
            z.null(),
        ])
            .optional(),
        premium_type: z.union([z.number(), z.null()]).optional(),
        nickname: z.string().optional(),
    })),
});
// SHARE_INTERACTION
const ShareInteractionRequestSchema = z.object({
    command: z.string(),
    content: z.string().max(2000).optional(),
    require_launch_channel: z.boolean().optional(),
    preview_image: z.object({ height: z.number(), url: z.string(), width: z.number() }).optional(),
    components: z
        .array(z.object({
        type: z.literal(1),
        components: z
            .array(z.object({
            type: z.literal(2),
            style: z.number().gte(1).lte(5),
            label: z.string().max(80).optional(),
            custom_id: z
                .string()
                .max(100)
                .describe('Developer-defined identifier for the button; max 100 characters')
                .optional(),
        }))
            .max(5)
            .optional(),
    }))
        .optional(),
});
const ShareInteractionResponseSchema = z.object({ success: z.boolean() });
// SHARE_LINK
const ShareLinkRequestSchema = z.object({
    custom_id: z.string().max(64).optional(),
    message: z.string().max(1000),
    link_id: z.string().max(64).optional(),
});
const ShareLinkResponseSchema = z.object({
    success: z.boolean(),
    didCopyLink: z.boolean(),
    didSendMessage: z.boolean(),
});
// GET_RELATIONSHIPS
const GetRelationshipsResponseSchema = z.object({
    relationships: z.array(z.object({
        type: z.number(),
        user: z.object({
            id: z.string(),
            username: z.string(),
            global_name: z.union([z.string(), z.null()]).optional(),
            discriminator: z.string(),
            avatar: z.union([z.string(), z.null()]).optional(),
            flags: z.number(),
            bot: z.boolean(),
            avatar_decoration_data: z
                .union([
                z.object({ asset: z.string(), skuId: z.string().optional(), expiresAt: z.number().optional() }),
                z.null(),
            ])
                .optional(),
            premium_type: z.union([z.number(), z.null()]).optional(),
        }),
        presence: z
            .object({
            status: z.string(),
            activity: z
                .union([
                z.object({
                    session_id: z.string().optional(),
                    type: z.number().optional(),
                    name: z.string(),
                    url: z.union([z.string(), z.null()]).optional(),
                    application_id: z.string().optional(),
                    state: z.string().optional(),
                    details: z.string().optional(),
                    emoji: z
                        .union([
                        z.object({
                            name: z.string(),
                            id: z.union([z.string(), z.null()]).optional(),
                            animated: z.union([z.boolean(), z.null()]).optional(),
                        }),
                        z.null(),
                    ])
                        .optional(),
                    assets: z
                        .object({
                        large_image: z.string().optional(),
                        large_text: z.string().optional(),
                        small_image: z.string().optional(),
                        small_text: z.string().optional(),
                    })
                        .optional(),
                    timestamps: z.object({ start: z.number().optional(), end: z.number().optional() }).optional(),
                    party: z
                        .object({
                        id: z.string().optional(),
                        size: z.array(z.number()).min(2).max(2).optional(),
                        privacy: z.number().optional(),
                    })
                        .optional(),
                    secrets: z.object({ match: z.string().optional(), join: z.string().optional() }).optional(),
                    sync_id: z.string().optional(),
                    created_at: z.number().optional(),
                    instance: z.boolean().optional(),
                    flags: z.number().optional(),
                    metadata: z.object({}).optional(),
                    platform: z.string().optional(),
                    supported_platforms: z.array(z.string()).optional(),
                    buttons: z.array(z.string()).optional(),
                    hangStatus: z.string().optional(),
                }),
                z.null(),
            ])
                .optional(),
        })
            .optional(),
    })),
});
// INVITE_USER_EMBEDDED
const InviteUserEmbeddedRequestSchema = z.object({
    user_id: z.string(),
    content: z.string().min(0).max(1024).optional(),
});
// GET_USER
const GetUserRequestSchema = z.object({ id: z.string().max(64) });
const GetUserResponseSchema = z.union([
    z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]).optional(),
        discriminator: z.string(),
        avatar: z.union([z.string(), z.null()]).optional(),
        flags: z.number(),
        bot: z.boolean(),
        avatar_decoration_data: z
            .union([z.object({ asset: z.string(), skuId: z.string().optional(), expiresAt: z.number().optional() }), z.null()])
            .optional(),
        premium_type: z.union([z.number(), z.null()]).optional(),
    }),
    z.null(),
]);
/**
 * RPC Commands which support schemas.
 */
var Command;
(function (Command) {
    Command["INITIATE_IMAGE_UPLOAD"] = "INITIATE_IMAGE_UPLOAD";
    Command["OPEN_SHARE_MOMENT_DIALOG"] = "OPEN_SHARE_MOMENT_DIALOG";
    Command["AUTHENTICATE"] = "AUTHENTICATE";
    Command["GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS"] = "GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS";
    Command["SHARE_INTERACTION"] = "SHARE_INTERACTION";
    Command["SHARE_LINK"] = "SHARE_LINK";
    Command["GET_RELATIONSHIPS"] = "GET_RELATIONSHIPS";
    Command["INVITE_USER_EMBEDDED"] = "INVITE_USER_EMBEDDED";
    Command["GET_USER"] = "GET_USER";
})(Command || (Command = {}));
const emptyResponseSchema = z.object({}).optional().nullable();
const emptyRequestSchema = z.void();
/**
 * Request & Response schemas for each supported RPC Command.
 */
const Schemas = {
    [Command.INITIATE_IMAGE_UPLOAD]: {
        request: emptyRequestSchema,
        response: InitiateImageUploadResponseSchema,
    },
    [Command.OPEN_SHARE_MOMENT_DIALOG]: {
        request: OpenShareMomentDialogRequestSchema,
        response: emptyResponseSchema,
    },
    [Command.AUTHENTICATE]: {
        request: AuthenticateRequestSchema,
        response: AuthenticateResponseSchema,
    },
    [Command.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS]: {
        request: emptyRequestSchema,
        response: GetActivityInstanceConnectedParticipantsResponseSchema,
    },
    [Command.SHARE_INTERACTION]: {
        request: ShareInteractionRequestSchema,
        response: ShareInteractionResponseSchema,
    },
    [Command.SHARE_LINK]: {
        request: ShareLinkRequestSchema,
        response: ShareLinkResponseSchema,
    },
    [Command.GET_RELATIONSHIPS]: {
        request: emptyRequestSchema,
        response: GetRelationshipsResponseSchema,
    },
    [Command.INVITE_USER_EMBEDDED]: {
        request: InviteUserEmbeddedRequestSchema,
        response: emptyResponseSchema,
    },
    [Command.GET_USER]: {
        request: GetUserRequestSchema,
        response: GetUserResponseSchema,
    },
};

export { AuthenticateRequestSchema, AuthenticateResponseSchema, Command, GetActivityInstanceConnectedParticipantsResponseSchema, GetRelationshipsResponseSchema, GetUserRequestSchema, GetUserResponseSchema, InitiateImageUploadResponseSchema, InviteUserEmbeddedRequestSchema, OpenShareMomentDialogRequestSchema, Schemas, ShareInteractionRequestSchema, ShareInteractionResponseSchema, ShareLinkRequestSchema, ShareLinkResponseSchema };
