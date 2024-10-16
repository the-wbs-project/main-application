DROP PROCEDURE IF EXISTS [dbo].[Invite_Update]
GO

CREATE PROCEDURE [dbo].[Invite_Update]
    @Id nvarchar(50),
    @LastInviteSentDate datetimeoffset,
    @SignupDate datetimeoffset,
    @Roles nvarchar(MAX)
AS
BEGIN
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();

    UPDATE [dbo].[Invites]
    SET [LastModifiedDate] = @ts,
        [LastInviteSentDate] = @LastInviteSentDate,
        [SignupDate] = @SignupDate,
        [Roles] = @Roles
    WHERE [Id] = @Id
END
        