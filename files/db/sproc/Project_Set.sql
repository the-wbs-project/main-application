DROP PROCEDURE IF EXISTS [dbo].[Project_Set]
GO

CREATE PROCEDURE [dbo].[Project_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @CreatedBy nvarchar(100),
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @Status nvarchar(50),
    @MainNodeView nvarchar(20),
    @Category nvarchar(50),
    @Disciplines nvarchar(MAX),
    @Roles nvarchar(MAX),
    @ApprovalStarted bit = NULL,
    @LibraryLink nvarchar(MAX)
AS
BEGIN
IF EXISTS(SELECT * FROM [dbo].[Projects] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Projects]
        SET [OwnerId] = @OwnerId,
            [CreatedBy] = @CreatedBy,
            [Title] = @Title,
            [Description] = @Description,
            [LastModified] = GETUTCDATE(),
            [Status] = @Status,
            [MainNodeView] = @MainNodeView,
            [Category] = @Category,
            [Disciplines] = @Disciplines,
            [Roles] = @Roles,
            [ApprovalStarted] = @ApprovalStarted,
            [LibraryLink] = @LibraryLink
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Projects]
        VALUES (@Id, @OwnerId, @CreatedBy, GETUTCDATE(), @Title, @Description, GETUTCDATE(), @Status, @MainNodeView, @Category, @Disciplines, @Roles, @ApprovalStarted, @LibraryLink)
    END
END
GO