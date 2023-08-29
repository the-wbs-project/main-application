DROP PROCEDURE IF EXISTS [dbo].[Project_Set]
GO

CREATE PROCEDURE [dbo].[Project_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @CreatedBy nvarchar(100),
    @CreatedOn datetime,
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @LastModified datetime,
    @Status nvarchar(50),
    @MainNodeView nvarchar(20),
    @Category nvarchar(50),
    @Phases nvarchar(MAX),
    @Disciplines nvarchar(MAX),
    @Roles nvarchar(MAX)
AS
BEGIN
IF EXISTS(SELECT * FROM [dbo].[Projects] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Projects]
        SET [OwnerId] = @OwnerId,
            [CreatedBy] = @CreatedBy,
            [CreatedOn] = @CreatedOn,
            [Title] = @Title,
            [Description] = @Description,
            [LastModified] = @LastModified,
            [Status] = @Status,
            [MainNodeView] = @MainNodeView,
            [Category] = @Category,
            [Phases] = @Phases,
            [Disciplines] = @Disciplines,
            [Roles] = @Roles
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Projects]
        VALUES (@Id, @OwnerId, @CreatedBy, @CreatedOn, @Title, @Description, @LastModified, @Status, @MainNodeView, @Category, @Phases, @Disciplines, @Roles)
    END
END
GO