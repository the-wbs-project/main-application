DROP PROCEDURE IF EXISTS [dbo].[Invite_Create]
GO

CREATE PROCEDURE [dbo].[Invite_Create]
    @Id nvarchar(50),
    @Email nvarchar(255),
    @OrganizationId nvarchar(100),
    @InvitedById nvarchar(50),
    @Roles nvarchar(MAX)
AS
BEGIN
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();

    INSERT INTO [dbo].[Invites]
        (
        [Id],
        [Email],
        [OrganizationId],
        [InvitedById],
        [CreationDate],
        [LastModifiedDate],
        [Roles],
        [Cancelled]
        )
    VALUES
        (
            @Id,
            @Email,
            @OrganizationId,
            @InvitedById,
            @ts,
            @ts,
            @Roles,
            0
        )
END
GO
